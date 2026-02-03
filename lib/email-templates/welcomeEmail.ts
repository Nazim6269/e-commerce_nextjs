export function welcomeEmail(name: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f9f9f9;">
      <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; overflow: hidden; margin-top: 20px;">
        <div style="background: #F35C7A; padding: 32px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">Welcome to Buyly!</h1>
        </div>
        <div style="padding: 32px;">
          <p style="font-size: 18px;">Hi ${name},</p>
          <p style="color: #666; line-height: 1.6;">
            Welcome to Buyly! We're thrilled to have you join our community of shoppers.
          </p>
          <p style="color: #666; line-height: 1.6;">
            Here's what you can do with your new account:
          </p>
          <ul style="color: #666; line-height: 2;">
            <li>Browse and shop from our wide collection of products</li>
            <li>Save items to your wishlist for later</li>
            <li>Track your orders in real-time</li>
            <li>Leave reviews and ratings</li>
            <li>Get personalized recommendations</li>
          </ul>
          <div style="text-align: center; margin: 32px 0;">
            <a href="${process.env.NEXTAUTH_URL || "http://localhost:3000"}/list"
               style="display: inline-block; background: #F35C7A; color: white; padding: 14px 32px; border-radius: 25px; text-decoration: none; font-weight: bold; font-size: 16px;">
              Start Shopping
            </a>
          </div>
          <p style="color: #999; font-size: 14px;">
            If you have any questions, feel free to reach out to our support team.
          </p>
        </div>
        <div style="background: #f8f8f8; padding: 16px; text-align: center; color: #999; font-size: 12px;">
          <p>&copy; ${new Date().getFullYear()} Buyly. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}
