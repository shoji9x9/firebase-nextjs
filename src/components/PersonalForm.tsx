"use client";

import { getLoginUserFromLocalStorage } from "@/services/auth";
import { getPersonalInfo } from "@/services/getPersonalInfo";
import { savePersonalInfo } from "@/services/savePersonalInfo";
import { messageAtom } from "@/states/messageAtom";
import { LoginUser, userAtom } from "@/states/userAtom";
import { PersonalInfo } from "@/types/types";
import { exceptionMessage, successMessage } from "@/utils/messages";
import { Box, Button, Stack, TextField } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { useRecoilState, useSetRecoilState } from "recoil";

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
  } = useForm<PersonalInfo>();

  const onSubmit: SubmitHandler<PersonalInfo> = (data) => {
    try {
      savePersonalInfo(data, loginUser);
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
        />
        <TextField
          variant="outlined"
          label="Email"
          type="email"
          required
          {...register("email")}
        />
        <Controller
          name="dateOfBirth"
          control={control}
          render={({ field }) => (
            <DatePicker
              label="Date of birth"
              slotProps={{ textField: { required: true } }}
              {...field}
              onChange={(value) => {
                field.onChange(value);
              }}
            />
          )}
        />
        <TextField
          variant="outlined"
          label="Zip code"
          type="number"
          required
          {...register("zipCode")}
        />
        <TextField
          variant="outlined"
          label="Address"
          required
          {...register("address")}
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
