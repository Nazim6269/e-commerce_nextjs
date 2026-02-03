import { User } from "@/actions/formAction";
import { userModel } from "@/models/userModel";
import { connectMongoDB } from "@/lib/mongodb";

//register user to database
export const registerToDB = async (userInfo: User) => {
  await connectMongoDB();
  const newUser = await userModel.create(userInfo);

  const res = await newUser.save();
  if (!res) {
    return { success: false, message: "Failed to Create account" };
  }
  return { success: true, message: "Successfully  Created account" };
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
