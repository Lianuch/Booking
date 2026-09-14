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
        subject: "Account activation on " + process.env.CLIENT_URL,
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
  async sendDeleteAccountMail(email: string) {
    try {
      const info = await this.transporter.sendMail({
        from: process.env.SMTP_USER,
        to: email,
        subject: "Your account has been successfully deleted.",
        text: "Your account has been successfully deleted.",
        html: `
                <div>
          <h1>Your account has been deleted</h1>

          <p>
            You successfully deleted your account.
          </p>

          <p>
            We are sorry to see you go. If you have any feedback or questions,
            please feel free to reach out to us.
          </p>

          <p>
            Thank you for using our service.
          </p>
        </div>
            `,
      });
      console.log("Email sent", info.messageId);
    } catch (e: any) {
      console.error("Error sending delete account email:", e.message);
    }
  }
}
