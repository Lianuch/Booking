import nodemailer from "nodemailer";
import "dotenv/config";
export class EmailService {
  private transporter: nodemailer.Transporter;
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });
  }
  async sendActivationMail(email: string, activationLink: string) {
    try {
      const info = await this.transporter.sendMail({
        from: process.env.SMTP_USER,
        to: email,
        subject: "Account activation on" + process.env.API_URL,
        text: "",
        html: `
                <div>
                    <h1>To activate your account, please follow the link below:</h1>
                    <a href="${activationLink}">${activationLink}</a>
                </div>
            `,
      });
      console.log("Email sent", info.messageId);
    } catch (e: any) {
      console.error("Error sending activation email:", e.message);
    }
  }
}
