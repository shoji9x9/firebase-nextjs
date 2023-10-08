"use client";

import { getLoginUserFromLocalStorage } from "@/services/auth";
import { getPersonalInfo } from "@/services/getPersonalInfo";
import { savePersonalInfo } from "@/services/savePersonalInfo";
import { messageAtom } from "@/states/messageAtom";
import { LoginUser, userAtom } from "@/states/userAtom";
import { PersonalInfo, PersonalInfoSchema } from "@/types/types";
import { exceptionMessage, successMessage } from "@/utils/messages";
import {
  Box,
  Button,
  FormControlLabel,
  Stack,
  Switch,
  TextField,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { useRecoilState, useSetRecoilState } from "recoil";
import { zodResolver } from "@hookform/resolvers/zod";

export function PersonalForm({
  setDirty,
}: {
  setDirty: (dirty: boolean) => void;
}) {
  // const [loginUser] = useRecoilState(userAtom);  ビルド時に実行してしまうため利用しない
  const [loginUser, setLoginUser] = useState<LoginUser>();
  const setMessageAtom = useSetRecoilState(messageAtom);
  const [loading, setLoading] = useState(true);
  const [canEdit, setCanEdit] = useState(false);

  const getInitialValue = async () => {
    let personalInfo: PersonalInfo = {
      fullName: "",
      email: "",
      dateOfBirth: dayjs(),
      zipCode: "",
      address: "",
    };
    try {
      const _loginUser = getLoginUserFromLocalStorage();
      setLoginUser(_loginUser);
      const _personalInfo = await getPersonalInfo(_loginUser);
      personalInfo.fullName =
        _personalInfo?.fullName || _loginUser.userName || "";
      personalInfo.email = _personalInfo?.email || _loginUser.email || "";
      personalInfo.dateOfBirth = dayjs(_personalInfo?.dateOfBirth) || dayjs();
      personalInfo.zipCode = _personalInfo?.zipCode || "";
      personalInfo.address = _personalInfo?.address || "";
      setLoading(false);
    } catch (error) {
      setMessageAtom((prev) => {
        return {
          ...prev,
          ...exceptionMessage(),
        };
      });
      setLoading(false);
    }
    return personalInfo;
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty, dirtyFields },
    control,
  } = useForm<PersonalInfo>({
    // modeをonSubmitにすることで、Saveボタンを押すまではフォーカスアウトのタイミングではバリデーションは動かないようになる
    mode: "onSubmit",
    // reValidateModeをonBlurにすることで、Saveボタンが押された後はフォーカスアウトのタイミングでバリデーションが走る
    reValidateMode: "onBlur",
    // デフォルト状態はフォーム要素全てが未定義(undefined)の状態として取り扱う
    defaultValues: getInitialValue,
    // zodResolverの引数にvalidation時に実行するschemaを渡す
    resolver: zodResolver(PersonalInfoSchema),
  });

  const onSubmit: SubmitHandler<PersonalInfo> = async (data) => {
    try {
      await savePersonalInfo(data, loginUser);
      setMessageAtom((prev) => {
        return {
          ...prev,
          ...successMessage("Saved"),
        };
      });
      // TODO: dirtyでないようにする。現状、Saveボタン押下してもdirtyのままになってしまっている
    } catch (error) {
      setMessageAtom((prev) => {
        return {
          ...prev,
          ...exceptionMessage(),
        };
      });
    }
  };

  const handleSwitchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCanEdit(event.target.checked);
  };

  useEffect(() => {
    // 値が変更されていなくてもisDirtyがtrueになってしまうため、dirtyFieldsの中身とあわせて判定する
    setDirty(isDirty && Object.keys(dirtyFields).length > 0);
  }, [isDirty, Object.keys(dirtyFields), setDirty]);

  if (loading) {
    return <></>;
  }

  return (
    <Box className="w-1/2">
      <Stack spacing={2}>
        <FormControlLabel
          control={
            <Switch
              checked={canEdit}
              disabled={canEdit}
              onChange={handleSwitchChange}
              inputProps={{ "aria-label": "controlled" }}
            />
          }
          label="Edit"
        />
        <Stack spacing={2}>
          <TextField
            variant="outlined"
            label="Full name"
            required
            {...register("fullName")}
            error={!!errors.fullName}
            helperText={errors.fullName?.message}
            disabled={!canEdit}
          />
          <TextField
            variant="outlined"
            label="Email"
            type="email"
            required
            {...register("email")}
            error={!!errors.email}
            helperText={errors.email?.message}
            disabled={!canEdit}
          />
          <Controller
            name="dateOfBirth"
            control={control}
            render={({ field }) => (
              <DatePicker
                {...field}
                label="Date of birth"
                slotProps={{
                  textField: {
                    required: true,
                    error: !!errors.dateOfBirth,
                    helperText: errors.dateOfBirth?.message,
                  },
                  field: { clearable: true },
                }}
                onChange={(value) => {
                  const _value = value === null ? "" : value;
                  field.onChange(_value);
                  field.onBlur();
                }}
                disabled={!canEdit}
              />
            )}
            // disabled={!canEdit}  // この指定をすることでdateOfBirthの値がundefinedになってしまっていた
          />
          <TextField
            variant="outlined"
            label="Zip code"
            required
            {...register("zipCode")}
            error={!!errors.zipCode}
            helperText={errors.zipCode?.message}
            disabled={!canEdit}
          />
          <TextField
            variant="outlined"
            label="Address"
            {...register("address")}
            error={!!errors.address}
            helperText={errors.address?.message}
            disabled={!canEdit}
          />
          <Box>
            <Button
              variant="outlined"
              disabled={!canEdit}
              onClick={() => setCanEdit(false)}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              className="ml-2"
              onClick={handleSubmit(onSubmit)}
              disabled={!canEdit}
            >
              Save
            </Button>
          </Box>
        </Stack>
      </Stack>
    </Box>
  );
}
