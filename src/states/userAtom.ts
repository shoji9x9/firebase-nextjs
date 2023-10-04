import { atom } from "recoil";

export type LoginUser = {
  userId: string | null;
  userName: string | null;
  email?: string | null;
};

export const userAtom = atom({
  key: "userAtom",
  default: {
    userId: null,
    userName: null,
    email: null,
  } as LoginUser,
});
