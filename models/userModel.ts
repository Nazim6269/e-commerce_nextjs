import bcrypt from "bcryptjs";
import mongoose, { Document, Model, Schema } from "mongoose";

export interface IUser extends Document {
  email: string;
  password: string;
  name: string;
  image?: string;
  confirmPassword?: string;
  role: "user" | "admin";
  emailPreferences: {
    orderUpdates: boolean;
    promotions: boolean;
    newsletter: boolean;
  };
}

const userSchema: Schema<IUser> = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      required: true,
      type: String,
    },
    image: {
      type: String,
    },
    confirmPassword: {
      type: String,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    emailPreferences: {
      orderUpdates: { type: Boolean, default: true },
      promotions: { type: Boolean, default: false },
      newsletter: { type: Boolean, default: false },
    },
  },
  { timestamps: true }
);

// Pre-save hook to hash password
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    if (this.confirmPassword) {
      this.confirmPassword = undefined;
    }
    next();
  } catch (error: any) {
    next(error);
  }
});

export const userModel: Model<IUser> =
  mongoose?.models?.User || mongoose.model<IUser>("User", userSchema);
