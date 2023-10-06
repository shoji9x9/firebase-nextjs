import dayjs from "dayjs";
import { z } from "zod";

export const PersonalInfoSchema = z.object({
  fullName: z.string().min(1, { message: "mandatory" }),
  email: z
    .string()
    .min(1, { message: "mandatory" })
    .email({ message: "should be in the format something@domain.com" }),
  dateOfBirth: z.instanceof(dayjs as unknown as typeof dayjs.Dayjs).refine((value) => {
    console.log("value", value);
    return value.isValid();
  }, {message: "invalid date"}).refine((value) => {
    return !value.isAfter(dayjs());
  }, {message: "future date"}),
  zipCode: z
    .string()
    .min(1, { message: "mandatory" })
    .regex(/^\d{3}-\d{4}$/, { message: "should be in the format 000-0000" }),
  address: z.string().optional(),
});

export type PersonalInfo = z.infer<typeof PersonalInfoSchema>;
