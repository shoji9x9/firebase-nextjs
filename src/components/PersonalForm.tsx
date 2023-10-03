"use client";

import { Box, Button, Stack, TextField } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { DateField } from "@mui/x-date-pickers/DateField";
import { useForm, SubmitHandler, Controller } from "react-hook-form";

type PersonalInfo = {
  fullName: string;
  email: string;
  dateOfBirth: string;
  zipCode: string;
  address: string;
};

export function PersonalForm() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    control,
  } = useForm<PersonalInfo>();
  const onSubmit: SubmitHandler<PersonalInfo> = (data) => console.log(data);

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
              onChange={(value) => field.onChange(value)}
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
          <Button variant="outlined">Cancel</Button>
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
