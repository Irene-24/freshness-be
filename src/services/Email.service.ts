import { promises as fs } from "fs";
import * as path from "path";
import * as Handlebars from "handlebars";
import * as nodemailer from "nodemailer";
import config from "@/src/config";
import { AppError } from "@/utils/APIError";
import SibApiV3Sdk from "@sendinblue/client";
import { ROLES } from "@/utils/commonType";

interface SendEmailConfig {
  templatePath: string;
  plainTextPath?: string;
  data: any;
  configData: {
    to: string | string[];
    subject: string;
    text?: string;
  };
  replacer?: (data: any, templateHtmlOrText: string) => string;
}

interface WelcomeBody {
  name: string;
  email: string;
  callbackUrl: string;
}

const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
apiInstance.setApiKey(
  SibApiV3Sdk.TransactionalEmailsApiApiKeys.apiKey,
  config.emailConfig.bravoKey as string
);

const EMAILPATHS = {
  html: "@/src/email-templates/html",
  text: "@/src/email-templates/text",
};

function replacePlaceholders(
  replacements: Record<string, any>,
  template: string
) {
  for (const [placeholder, value] of Object.entries(replacements)) {
    const regex = new RegExp(`{{${placeholder}}}`, "g");
    template = template.replace(regex, value);
  }

  return template;
}

class EmailService {
  static async sendEmail({
    templatePath,
    plainTextPath,
    data,
    configData,
    replacer,
  }: SendEmailConfig) {
    try {
      let templateHtml = await fs.readFile(path.resolve(templatePath), "utf8");

      if (replacer) {
        templateHtml = replacer(data, templateHtml);
      }

      const compiledTemplate = Handlebars.compile(templateHtml);

      const finalHtml = compiledTemplate(data);

      const mailBody = {
        ...configData,
        to: Array.isArray(configData.to)
          ? configData.to.join(", ")
          : configData.to,
        html: finalHtml,
      };

      if (plainTextPath) {
        mailBody.text = await fs.readFile(path.resolve(plainTextPath), "utf8");

        if (replacer) {
          mailBody.text = replacer(data, mailBody.text);
        }
      }

      if (config.isProd) {
        const sendSmtpEmail = {
          subject: mailBody.subject,
          htmlContent: finalHtml,
          textContent: mailBody.text,
          sender: { email: mailBody.to },
          to: Array.isArray(configData.to)
            ? configData.to.map((email) => ({ email }))
            : [{ email: configData.to }],
        };

        await apiInstance.sendTransacEmail(sendSmtpEmail);
      } else {
        const testAccount = await nodemailer.createTestAccount();

        const transporter = nodemailer.createTransport({
          host: "smtp.ethereal.email",
          port: 587,
          secure: false, // true for 465, false for other ports
          auth: {
            user: testAccount.user, // generated ethereal user
            pass: testAccount.pass, // generated ethereal password
          },
        });

        const info = await transporter.sendMail(mailBody);

        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
        // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
      }

      return true;
    } catch (error: any) {
      throw new AppError({
        body: error?.response?.body ?? error,
        message:
          error.message ?? "Error logging user in with this email/password",
        statusCode: error?.statusCode ?? 400,
      });
    }
  }

  static async registerUser(body: WelcomeBody, role: ROLES) {
    const emailConfig: SendEmailConfig = {
      templatePath: `${EMAILPATHS.html}/confirm-email.html`,
      plainTextPath: `${EMAILPATHS.text}/confirm-email.txt`,
      data: { ...body, isCustomer: ROLES.CUSTOMER === role, role },
      configData: {
        to: body.email,
        subject: "Confirm Your Email Address - Welcome to Freshness!",
      },
      replacer: replacePlaceholders,
    };

    return await EmailService.sendEmail(emailConfig);
  }

  static async sendCustomerReg(body: WelcomeBody) {
    return await EmailService.registerUser(body, ROLES.CUSTOMER);
  }

  static async sendMerchantReg(body: WelcomeBody) {
    return await EmailService.registerUser(body, ROLES.MERCHANT);
  }

  static async sendAdminCreate() {
    return;
  }
}

export default EmailService;
