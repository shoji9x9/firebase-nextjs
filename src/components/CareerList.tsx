import { useEffect, useState } from "react";
import { CareerForm } from "./CareerForm";
import { Career } from "@/types/types";
import { getCareers } from "@/services/getCareers";
import { getLoginUserFromLocalStorage } from "@/services/auth";
import { LoginUser } from "@/states/userAtom";

export function CareerList({
  setDirty,
}: {
  setDirty: (dirty: boolean) => void;
}) {
  const [careers, setCareers] = useState<Career[]>([]);
  const [loginUser, setLoginUser] = useState<LoginUser>();
  const [loading, setLoading] = useState(true);

  // TODO: Addボタン追加後に削除
  const defaultValue: Career = {
    isEditing: false,
    projectName: "",
    isPresent: false,
    startYearMonth: undefined,
    endYearMonth: undefined,
    techStack: [],
    summary: "",
    teamSize: 0,
  };

  useEffect(() => {
    const _getCareers = async () => {
      const _loginUser = getLoginUserFromLocalStorage();
      setLoginUser(_loginUser);
      const _careers = await getCareers(_loginUser);

      setCareers(_careers.map((career) => ({ ...career, isEditing: false })));
      setLoading(false);
    };

    _getCareers();
  }, []);

  if (loading) {
    return <></>;
  }

  return (
    <CareerForm career={careers[0] || defaultValue} loginUser={loginUser} />
  );
}
