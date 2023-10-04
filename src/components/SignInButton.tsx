"use client";

import { Button } from "@mui/material";
import { useRouter } from "next/navigation";
import GoogleIcon from "@mui/icons-material/Google";
import { setUserToLocalStorage, signInWithGoogle } from "@/services/auth";
import { useRecoilState, useSetRecoilState } from "recoil";
import { userAtom } from "@/states/userAtom";
import { use } from "react";

declare module "@mui/material/Button" {
  interface ButtonPropsColorOverrides {
    blue: true;
  }
}

export function SignInButton() {
  const router = useRouter();
  const [loginUser] = useRecoilState(userAtom);
  const setUserAtom = useSetRecoilState(userAtom);
  const signIn = async () => {
    // サインインしていない場合はサインインする
    if (!loginUser.userId) {
      const userCredential = await signInWithGoogle();

      const user = userCredential?.user;

      setUserAtom((prev) => {
        return {
          ...prev,
          userId: user?.uid || null,
          userName: user?.displayName || null,
          email: user?.email || null,
        };
      });

      setUserToLocalStorage(user);
    }

    router.push("/careers");
  };

  return (
    <Button
      variant="contained"
      color="blue"
      startIcon={<GoogleIcon />}
      onClick={() => signIn()}
    >
      Sign in with Google
    </Button>
  );
}
