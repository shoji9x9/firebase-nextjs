import dayjs from "dayjs";
import { z } from "zod";

export const PersonalInfoSchema = z.object({
  fullName: z.string().min(1, { message: "mandatory" }),
  email: z
    .string()
    .min(1, { message: "mandatory" })
    .email({ message: "should be in the format something@domain.com" }),
  dateOfBirth: z.union([
    z.string().min(1, { message: "mandatory" }),
    z.instanceof(dayjs as unknown as typeof dayjs.Dayjs),
  ]),
  zipCode: z
    .string()
    .min(1, { message: "mandatory" })
    .regex(/^\d{3}-\d{4}$/, { message: "should be in the format 000-0000" }),
  address: z.string().optional(),
});

export type PersonalInfo = z.infer<typeof PersonalInfoSchema>;
