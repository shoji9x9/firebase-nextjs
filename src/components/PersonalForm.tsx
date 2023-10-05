"use client";

import { getLoginUserFromLocalStorage } from "@/services/auth";
import { getPersonalInfo } from "@/services/getPersonalInfo";
import { savePersonalInfo } from "@/services/savePersonalInfo";
import { messageAtom } from "@/states/messageAtom";
import { LoginUser, userAtom } from "@/states/userAtom";
import { PersonalInfo, PersonalInfoSchema } from "@/types/types";
import { exceptionMessage, successMessage } from "@/utils/messages";
import { Box, Button, Stack, TextField } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { useRecoilState, useSetRecoilState } from "recoil";
import { zodResolver } from "@hookform/resolvers/zod";

export function PersonalForm() {
  // const [loginUser] = useRecoilState(userAtom);  ビルド時に実行してしまうため利用しない
  const [loginUser, setLoginUser] = useState<LoginUser>();
  const setMessageAtom = useSetRecoilState(messageAtom);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    control,
    setValue,
  } = useForm<PersonalInfo>({
    // modeをonSubmitにすることで、Saveボタンを押すまではフォーカスアウトのタイミングではバリデーションは動かないようになる
    mode: "onSubmit",
    // reValidateModeをonBlurにすることで、Saveボタンが押された後はフォーカスアウトのタイミングでバリデーションが走る
    reValidateMode: "onBlur",
    // デフォルト状態はフォーム要素全てが未定義(undefined)の状態として取り扱う
    defaultValues: undefined,
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
      router.push("/careers");
    } catch (error) {
      setMessageAtom((prev) => {
        return {
          ...prev,
          ...exceptionMessage(),
        };
      });
    }
  };

  useEffect(() => {
    const _loginUser = getLoginUserFromLocalStorage();
    setLoginUser(_loginUser);
    const personalInfoPromiss = getPersonalInfo(_loginUser);
    personalInfoPromiss
      .then((personalInfo) => {
        setValue<"fullName">(
          "fullName",
          personalInfo?.fullName || _loginUser.userName || ""
        );
        setValue<"email">(
          "email",
          personalInfo?.email || _loginUser.email || ""
        );
        setValue<"dateOfBirth">(
          "dateOfBirth",
          dayjs(personalInfo?.dateOfBirth) || ""
        );
        setValue<"zipCode">("zipCode", personalInfo?.zipCode || "");
        setValue<"address">("address", personalInfo?.address || "");
      })
      .catch((error) => {
        setMessageAtom((prev) => {
          return {
            ...prev,
            ...exceptionMessage(),
          };
        });
      })
      .finally(() => {
        setLoading(false);
      });
  }, [setValue, setMessageAtom]);

  if (loading) {
    return <></>;
  }

  return (
    <Box className="w-1/2">
      <Stack spacing={2}>
        <TextField
          variant="outlined"
          label="Full name"
          required
          {...register("fullName")}
          error={!!errors.fullName}
          helperText={errors.fullName?.message}
        />
        <TextField
          variant="outlined"
          label="Email"
          type="email"
          required
          {...register("email")}
          error={!!errors.email}
          helperText={errors.email?.message}
        />
        <Controller
          name="dateOfBirth"
          control={control}
          render={({ field }) => (
            <DatePicker
              label="Date of birth"
              slotProps={{
                textField: {
                  required: true,
                  error: !!errors.dateOfBirth,
                  helperText: errors.dateOfBirth?.message,
                  onBlur: field.onBlur,
                },
                field: { clearable: true },
              }}
              {...field}
              onChange={(value) => {
                const _value = value === null ? "" : value;
                field.onChange(_value);
                field.onBlur();
              }}
            />
          )}
        />
        <TextField
          variant="outlined"
          label="Zip code"
          required
          {...register("zipCode")}
          error={!!errors.zipCode}
          helperText={errors.zipCode?.message}
        />
        <TextField
          variant="outlined"
          label="Address"
          {...register("address")}
          error={!!errors.address}
          helperText={errors.address?.message}
        />
        <Box>
          <Link href="/careers">
            <Button variant="outlined">Cancel</Button>
          </Link>
          <Button
            variant="contained"
            className="ml-2"
            onClick={handleSubmit(onSubmit)}
          >
            Save
          </Button>
        </Box>
      </Stack>
    </Box>
  );
}
