import { promises as fs } from "fs";
import * as Handlebars from "handlebars";
import * as nodemailer from "nodemailer";
import config from "@/src/config";
import { AppError } from "@/utils/APIError";
import SibApiV3Sdk from "@sendinblue/client";

interface SendEmailConfig {
  templatePath: string;
  plainTextPath?: string;
  data: any;
  configData: {
    from: string;
    to: string | string[];
    subject: string;
    text?: string;
  };
  replacer?: (data: any, templateHtmlOrText: string) => string;
}

const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
apiInstance.setApiKey(
  SibApiV3Sdk.TransactionalEmailsApiApiKeys.apiKey,
  config.emailConfig.bravoKey as string
);

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

        await transporter.sendMail(mailBody);
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

  static async sendCustomerReg() {
    return;
  }

  static async sendMerchantReg() {
    return;
  }

  static async sendAdminCreate() {
    return;
  }
}

export default EmailService;
