import { getDoc, doc } from "firebase/firestore";
import { LoginUser } from "../states/userAtom";
import { database } from "../infrastructure/firebase";
import { PersonalInfo } from "@/types/types";

export async function getPersonalInfo(loginUser?: LoginUser) {
  if (loginUser?.userId) {
    try {
      const ref = doc(database, "users", loginUser.userId);
      const result = await getDoc(ref);
      return result.data() as PersonalInfo;
    } catch (e) {
      console.error(e);
      throw e;
    }
  } else {
    console.error("User id is empty!", loginUser);
    throw new Error();
  }
}
