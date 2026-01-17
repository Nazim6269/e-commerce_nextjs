"use server";

import { SignInStateProps } from "@/app/signin/page";
import { SignUpStateProps } from "@/app/signup/page";
import { signIn, signOut } from "@/auth";
import { registerToDB } from "@/lib/dbQuery";
import { revalidatePath } from "next/cache";
export interface User {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

//manual signup action
export const signUpAction = async (
  _prevState: SignUpStateProps,
  formData: FormData
): Promise<SignUpStateProps> => {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  const userInfo = { name, email, password, confirmPassword };
  if (name.length < 3) {
    return {
      success: false,
      message: "Username must be minimum 3 letters",
    };
  }

  const res = await registerToDB(userInfo);
  if (!res) {
    return { success: false, message: "Failed to Sign up" };
  }

  return { success: true, message: "Successfully created account" };
};

//login action
export const loginAction = async (
  _prevState: SignInStateProps,
  formData: FormData
): Promise<SignInStateProps> => {
  const loginData = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    redirect: false,
  };

  const res = await signIn("credentials", loginData);

  if (!res) {
    return { success: false, message: "Failed to loign" };
  } else {
    revalidatePath("/");
    return { success: true, message: "Successfully login!!!" };
  }
};

//sign out action
export const doSignOut = async () => {
  console.log("sign out action")
  await signOut({
    redirectTo: "/",
  });
};
