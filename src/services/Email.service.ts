import { promises as fs } from "fs";
import * as path from "path";
import * as Handlebars from "handlebars";
import * as SibApiV3Sdk from "@sendinblue/client";

import config from "@/src/config";
import { AppError } from "@/utils/APIError";
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

interface ConfirmWelcomeBody {
  name: string;
  email: string;
  callbackUrl: string;
}

const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

apiInstance.setApiKey(
  SibApiV3Sdk.TransactionalEmailsApiApiKeys.apiKey,
  config.emailConfig.brevoKey as string
);

const EMAILPATHS = {
  html: path.resolve(__dirname, "../email-templates/html"),
  text: path.resolve(__dirname, "../email-templates/text"),
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
      let templateHtml = await fs.readFile(templatePath, "utf8");

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
        mailBody.text = await fs.readFile(plainTextPath, "utf8");

        if (replacer) {
          mailBody.text = replacer(data, mailBody.text);
        }
      }

      const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

      sendSmtpEmail.subject = mailBody.subject;
      sendSmtpEmail.htmlContent = finalHtml;
      sendSmtpEmail.textContent = mailBody.text;
      sendSmtpEmail.sender = { email: mailBody.to };
      sendSmtpEmail.to = Array.isArray(configData.to)
        ? configData.to.map((email) => ({ email }))
        : [{ email: configData.to }];

      await apiInstance.sendTransacEmail(sendSmtpEmail);

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

  static async registerUser(body: ConfirmWelcomeBody, role: ROLES) {
    const emailConfig: SendEmailConfig = {
      templatePath: `${EMAILPATHS.html}/confirm-email.html`,
      plainTextPath: `${EMAILPATHS.text}/confirm-email.txt`,
      data: {
        ...body,
        isCustomer: ROLES.CUSTOMER === role,
        role: role.toLowerCase(),
      },
      configData: {
        to: body.email,
        subject: "Confirm Your Email Address - Welcome to Freshness!",
      },
      replacer: replacePlaceholders,
    };

    return await EmailService.sendEmail(emailConfig);
  }

  static async sendCustomerReg(body: ConfirmWelcomeBody) {
    return await EmailService.registerUser(body, ROLES.CUSTOMER);
  }

  static async sendMerchantReg(body: ConfirmWelcomeBody) {
    return await EmailService.registerUser(body, ROLES.MERCHANT);
  }

  static async sendAdminCreate() {
    return;
  }

  static async welcomeUser(
    body: ConfirmWelcomeBody,
    role: Exclude<ROLES, ROLES.ADMIN>
  ) {
    const emailConfig: SendEmailConfig = {
      templatePath: `${EMAILPATHS.html}/welcome-${role.toLowerCase()}.html`,
      plainTextPath: `${EMAILPATHS.text}/welcome-${role.toLowerCase()}.txt`,
      data: { ...body, websiteUrl: body.callbackUrl },
      configData: {
        to: body.email,
        subject: "Welcome to Freshness - Let's Get Started!",
      },
      replacer: replacePlaceholders,
    };

    return await EmailService.sendEmail(emailConfig);
    return;
  }
}

export default EmailService;
