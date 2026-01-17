import mongoose, { Document, Model, Schema } from "mongoose";

export interface IWishlistItem extends Document {
  userId: string;
  productId: string;
  slug: string;
  createdAt: Date;
}

const wishlistSchema = new Schema<IWishlistItem>(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    productId: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// Prevent overwrite model error in dev mode
export const WishlistModel: Model<IWishlistItem> =
  mongoose.models.Wishlist || mongoose.model<IWishlistItem>("Wishlist", wishlistSchema);
