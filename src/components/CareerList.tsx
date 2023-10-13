import { Fragment, useEffect, useState } from "react";
import { CareerForm } from "./CareerForm";
import {
  Career,
  CareerSchema,
  CareerFieldArray,
  CareerFieldArraySchema,
} from "@/types/types";
import { getCareers } from "@/services/getCareers";
import { getLoginUserFromLocalStorage } from "@/services/auth";
import { LoginUser } from "@/states/userAtom";
import { AddButton } from "./AddButton";
import { Box } from "@mui/material";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

export function CareerList({
  setDirty,
}: {
  setDirty: (dirty: boolean) => void;
}) {
  const [loginUser, setLoginUser] = useState<LoginUser>();
  const [loading, setLoading] = useState(true);

  const {
    // formState: { errors, isDirty, dirtyFields },
    formState,
    control,
    ...rest
  } = useForm<CareerFieldArray>({
    mode: "onSubmit",
    reValidateMode: "onBlur",
    resolver: zodResolver(CareerFieldArraySchema),
  });
  const { fields, append, remove, insert } = useFieldArray({
    control,
    name: "fieldArray",
  });

  // TODO: 追加、削除されたことがわかりづらいためアニメーションをつける
  const addForm = (idx: number) => {
    const defaultValue: Career = {
      isEditing: false,
      projectName: "",
      isPresent: false,
      startYearMonth: null,
      endYearMonth: null,
      techStack: [],
      summary: "",
      teamSize: null,
    };
    insert(idx, defaultValue);
  };

  const deleteForm = (idx: number) => {
    remove(idx);
  };

  // TODO: あるフォームを編集中は他のフォームを編集できなくする
  // TODO: あるフォームを編集中はタブ切り替え時に確認ダイアログを表示する

  useEffect(() => {
    const _getCareers = async () => {
      const _loginUser = getLoginUserFromLocalStorage();
      setLoginUser(_loginUser);
      const _careers = await getCareers(_loginUser);

      for (const _career of _careers) {
        append({ ..._career, isEditing: false });
      }
      setLoading(false);
    };

    _getCareers();
  }, []);

  if (loading) {
    return <></>;
  }

  return (
    <Box className="w-2/3">
      <AddButton onClick={() => addForm(0)} />
      {fields.map((field, index) => {
        return (
          <Fragment key={`${field.id}_${index}`}>
            <CareerForm
              career={field}
              index={index}
              useFormReturn={{
                formState: formState,
                control: control,
                ...rest,
              }}
              loginUser={loginUser}
              deleteForm={deleteForm}
            />
            <AddButton onClick={() => addForm(index + 1)} />
          </Fragment>
        );
      })}
    </Box>
  );
}
