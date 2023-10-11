import { collection, getDocs } from "firebase/firestore";
import { LoginUser } from "../states/userAtom";
import { database } from "../infrastructure/firebase";
import { Career } from "@/types/types";
import dayjs from "dayjs";

export async function getCareers(
  loginUser?: LoginUser
): Promise<Omit<Career, "isEditing">[]> {
  if (loginUser?.userId) {
    try {
      const ref = collection(database, "users", loginUser.userId, "career");
      const results = await getDocs(ref);
      const careers: Omit<Career, "isEditing">[] = [];
      results.forEach((result) => {
        const _data: Omit<Career, "isEditing"> = {
          ...(result.data() as Omit<Career, "isEditing">),
          id: result.id,
          startYearMonth: dayjs(result.data().startYearMonth),
          endYearMonth: result.data().endYearMonth
            ? dayjs(result.data().endYearMonth)
            : result.data().endYearMonth,
        };
        careers.push(_data);
      });
      return careers;
    } catch (e) {
      console.error(e);
      throw e;
    }
  } else {
    console.error("User id is empty!", loginUser);
    throw new Error();
  }
}
