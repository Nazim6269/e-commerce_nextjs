import { Suspense } from "react";
import SignInClient from "./signin-client";
//stateProps
export type SignInStateProps = {
  email?: string;
  password?: string;
  success?: boolean;
  message?: string;
};

const SignIn = () => {
  return (
    <Suspense>
      <SignInClient />
    </Suspense>
  );
};

export default SignIn;
