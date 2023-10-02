"use client";

import { clearUserInLocalStorage, signOutWithGoogle } from "@/services/auth";
import { userAtom } from "@/states/userAtom";
import { Button } from "@mui/material";
import { useRouter } from "next/navigation";
import { useSetRecoilState } from "recoil";

export function SignOutButton() {
  const router = useRouter();
  const setUserAtom = useSetRecoilState(userAtom);

  const signOut = async () => {
    signOutWithGoogle();
    setUserAtom(() => {
      return {
        userId: null,
        userName: null,
      };
    });
    clearUserInLocalStorage();
    router.push("/");
  };
  return (
    <Button variant="outlined" onClick={() => signOut()}>
      Sign out
    </Button>
  );
}
