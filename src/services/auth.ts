import { User, signInWithPopup } from "firebase/auth";
import { auth, provider } from "../infrastructure/firebase";
import { LoginUser } from "@/states/userAtom";

export async function signInWithGoogle() {
  try {
    const userCredential = await signInWithPopup(auth, provider);
    return userCredential;
  } catch (e) {
    console.error(e);
    throw e;
  }
}

export async function signOutWithGoogle() {
  try {
    await auth.signOut();
  } catch (e) {
    console.error(e);
    throw e;
  }
}

export function setUserToLocalStorage(user?: User) {
  // リロード対策のため、LocalStorageにUIDを永続化しておく
  if (user?.uid) {
    localStorage.setItem("userId", user.uid);
    localStorage.setItem("userName", user.displayName || "");
    localStorage.setItem("email", user.email || "");
  }
}

export function getLoginUserFromLocalStorage(): LoginUser {
  const loginUser: LoginUser = {
    userId: localStorage.getItem("userId"),
    userName: localStorage.getItem("userName"),
    email: localStorage.getItem("email"),
  };
  return loginUser;
}

export function clearUserInLocalStorage() {
  localStorage.removeItem("userId");
  localStorage.removeItem("userName");
  localStorage.removeItem("email");
}
