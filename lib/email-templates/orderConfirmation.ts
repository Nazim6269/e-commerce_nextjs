interface OrderItem {
  name: string;
  price: number;
  quantity: number;
}

interface OrderConfirmationData {
  customerName: string;
  orderId: string;
  items: OrderItem[];
  total: number;
  shippingAddress?: string;
}

export function orderConfirmationEmail(data: OrderConfirmationData): string {
  const itemRows = data.items
    .map(
      (item) => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #eee;">${item.name}</td>
      <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
      <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right;">$${(item.price * item.quantity).toFixed(2)}</td>
    </tr>
  `
    )
    .join("");

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
          <h1 style="color: white; margin: 0; font-size: 24px;">Order Confirmed!</h1>
        </div>
        <div style="padding: 24px;">
          <p style="font-size: 16px;">Hi ${data.customerName},</p>
          <p style="color: #666;">Thank you for your order! We've received your order and it's being processed.</p>

          <div style="background: #f8f8f8; padding: 16px; border-radius: 8px; margin: 16px 0;">
            <p style="margin: 0; font-weight: bold;">Order ID: ${data.orderId}</p>
          </div>

          <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
            <thead>
              <tr style="background: #f8f8f8;">
                <th style="padding: 12px; text-align: left;">Item</th>
                <th style="padding: 12px; text-align: center;">Qty</th>
                <th style="padding: 12px; text-align: right;">Price</th>
              </tr>
            </thead>
            <tbody>${itemRows}</tbody>
          </table>

          <div style="text-align: right; padding: 16px 0; border-top: 2px solid #F35C7A;">
            <p style="font-size: 20px; font-weight: bold; color: #F35C7A; margin: 0;">
              Total: $${data.total.toFixed(2)}
            </p>
          </div>

          ${data.shippingAddress ? `<p style="color: #666; font-size: 14px;">Shipping to: ${data.shippingAddress}</p>` : ""}

          <p style="color: #666; font-size: 14px; margin-top: 24px;">
            We'll send you another email when your order ships.
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
