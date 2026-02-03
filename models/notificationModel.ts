import mongoose, { Document, Model, Schema } from "mongoose";

export interface INotification extends Document {
  userId: mongoose.Types.ObjectId;
  type:
    | "order_placed"
    | "order_shipped"
    | "order_delivered"
    | "price_drop"
    | "back_in_stock"
    | "review_reply"
    | "welcome"
    | "promo";
  title: string;
  message: string;
  link?: string;
  read: boolean;
  createdAt: Date;
}

const notificationSchema: Schema<INotification> = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: [
        "order_placed",
        "order_shipped",
        "order_delivered",
        "price_drop",
        "back_in_stock",
        "review_reply",
        "welcome",
        "promo",
      ],
      required: true,
    },
    title: { type: String, required: true },
    message: { type: String, required: true },
    link: { type: String },
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const NotificationModel: Model<INotification> =
  mongoose.models?.Notification ||
  mongoose.model<INotification>("Notification", notificationSchema);
