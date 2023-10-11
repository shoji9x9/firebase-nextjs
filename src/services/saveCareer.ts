import { collection, addDoc, doc, setDoc } from "firebase/firestore";
import { database } from "../infrastructure/firebase";
import { LoginUser } from "../states/userAtom";
import { Career } from "../types/types";
import dayjs from "dayjs";

export async function saveCareer(career: Career, loginUser?: LoginUser) {
  if (loginUser?.userId) {
    try {
      if (career.id) {
        // 更新
        const ref = doc(
          database,
          "users",
          loginUser.userId,
          "career",
          career.id
        );
        const { isEditing, ..._career } = {
          ...career,
          startYearMonth: dayjs(career.startYearMonth).format("YYYY-MM"),
          endYearMonth: career.endYearMonth
            ? dayjs(career.endYearMonth).format("YYYY-MM")
            : null,
        };
        await setDoc(ref, _career);
      } else {
        // 登録
        const ref = collection(database, "users", loginUser.userId, "career");
        const { id, isEditing, ..._career } = {
          ...career,
          startYearMonth: dayjs(career.startYearMonth).format("YYYY-MM"),
          endYearMonth: career.endYearMonth
            ? dayjs(career.endYearMonth).format("YYYY-MM")
            : null,
        };
        await addDoc(ref, _career);
      }
    } catch (e) {
      console.error(e);
      throw e;
    }
  } else {
    console.error("User id is empty!", loginUser);
    throw new Error();
  }
}
