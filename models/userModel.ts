import mongoose, { Document, Model, Schema } from "mongoose";

interface IUser extends Document {
  email: string;
  password: string;
  name: string;
  image?: string;
  confirmPassword?: string;
}

const userSchema: Schema<IUser> = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
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
});

export const userModel: Model<IUser> =
  mongoose?.models.User || mongoose.model<IUser>("User", userSchema);
