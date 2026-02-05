import { User } from "@/actions/formAction";
import { userModel } from "@/models/userModel";
import { connectMongoDB } from "@/lib/mongodb";

//register user to database
export const registerToDB = async (userInfo: User) => {
  try {
    await connectMongoDB();
    await userModel.create(userInfo);
    return { success: true, message: "Successfully created account" };
  } catch (error: any) {
    if (error.code === 11000) {
      return { success: false, message: "Email already exists" };
    }
    return { success: false, message: "Failed to create account" };
  }
};

//searching user using email
export const findUserFromDB = async (email: string) => {
  try {
    await connectMongoDB();
    return await userModel.findOne({ email: email });
  } catch (error) {
    throw error;
  }
};
