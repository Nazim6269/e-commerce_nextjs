interface OrderShippedData {
  customerName: string;
  orderId: string;
  trackingNumber?: string;
}

export function orderShippedEmail(data: OrderShippedData): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f9f9f9;">
      <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; overflow: hidden; margin-top: 20px;">
        <div style="background: #F35C7A; padding: 24px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 24px;">Your Order Has Shipped!</h1>
        </div>
        <div style="padding: 24px;">
          <p style="font-size: 16px;">Hi ${data.customerName},</p>
          <p style="color: #666;">Great news! Your order is on its way.</p>

          <div style="background: #f0fdf4; padding: 16px; border-radius: 8px; margin: 16px 0; border: 1px solid #bbf7d0;">
            <p style="margin: 0; font-weight: bold; color: #166534;">Order ID: ${data.orderId}</p>
            ${data.trackingNumber ? `<p style="margin: 8px 0 0; color: #166534;">Tracking Number: ${data.trackingNumber}</p>` : ""}
          </div>

          <div style="text-align: center; margin: 24px 0;">
            <a href="${process.env.NEXTAUTH_URL || "http://localhost:3000"}/orders"
               style="display: inline-block; background: #F35C7A; color: white; padding: 12px 28px; border-radius: 25px; text-decoration: none; font-weight: bold;">
              Track Your Order
            </a>
          </div>

          <p style="color: #666; font-size: 14px;">
            You'll receive another notification when your package is delivered.
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
