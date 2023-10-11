import { doc, deleteDoc } from "firebase/firestore";
import { database } from "../infrastructure/firebase";
import { LoginUser } from "../states/userAtom";

export async function deleteCareer(careerId: string, loginUser?: LoginUser) {
  if (loginUser?.userId) {
    try {
      const ref = doc(database, "users", loginUser.userId, "career", careerId);
      await deleteDoc(ref);
    } catch (e) {
      console.error(e);
      throw e;
    }
  } else {
    console.error("User id is empty!", loginUser);
    throw new Error();
  }
}
