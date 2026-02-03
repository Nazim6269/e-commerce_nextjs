import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

export async function sendEmail(
  to: string,
  subject: string,
  html: string
): Promise<{ success: boolean; error?: string }> {
  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
    console.warn("Email credentials not configured, skipping email send");
    return { success: false, error: "Email credentials not configured" };
  }

  try {
    await transporter.sendMail({
      from: `"Buyly Store" <${process.env.GMAIL_USER}>`,
      to,
      subject,
      html,
    });
    return { success: true };
  } catch (error: any) {
    console.error("Failed to send email:", error.message);
    return { success: false, error: error.message };
  }
}
