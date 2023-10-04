import { collection, addDoc, doc, setDoc } from "firebase/firestore";
import { database } from "../infrastructure/firebase";
import { LoginUser } from "../states/userAtom";
import { PersonalInfo } from "../types/types";
import dayjs from "dayjs";

export async function savePersonalInfo(
  personalInfo: PersonalInfo,
  loginUser?: LoginUser
) {
  if (loginUser?.userId) {
    try {
      const ref = doc(database, "users", loginUser.userId);
      const _personalInfo = {
        ...personalInfo,
        dateOfBirth: dayjs(personalInfo.dateOfBirth).format(),
      };
      await setDoc(ref, _personalInfo);
    } catch (e) {
      console.error(e);
      throw e;
    }
  } else {
    console.error("User id is empty!", loginUser);
    throw new Error();
  }
}
