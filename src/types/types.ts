import dayjs from "dayjs";
import { ZodType, z } from "zod";
import { techStacks } from "./techStacks";

export const PersonalInfoSchema = z.object({
  fullName: z.string().min(1, { message: "mandatory" }),
  email: z
    .string()
    .min(1, { message: "mandatory" })
    .email({ message: "should be in the format something@domain.com" }),
  dateOfBirth: z.union([
    z
      .string()
      .refine(
        (value) => {
          return dayjs(value).isValid();
        },
        { message: "invalid date" }
      )
      .refine(
        (value) => {
          return !dayjs(value).isAfter(dayjs());
        },
        { message: "future date" }
      ),
    z
      .instanceof(dayjs as unknown as typeof dayjs.Dayjs)
      .refine(
        (value) => {
          return value.isValid();
        },
        { message: "invalid date" }
      )
      .refine(
        (value) => {
          return !value.isAfter(dayjs());
        },
        { message: "future date" }
      ),
  ]),
  zipCode: z
    .string()
    .min(1, { message: "mandatory" })
    .regex(/^\d{3}-\d{4}$/, { message: "should be in the format 000-0000" }),
  address: z.string().optional(),
});

export type PersonalInfo = z.infer<typeof PersonalInfoSchema>;

export const CareerSchema = z
  .object({
    projectName: z.string().min(1, { message: "mandatory" }),
    startYearMonth: z.union([
      z.null().refine(
        (value) => {
          return false;
        },
        { message: "mandatory" }
      ),
      z.string().refine(
        (value) => {
          return dayjs(value).isValid();
        },
        { message: "invalid date" }
      ),
      z.instanceof(dayjs as unknown as typeof dayjs.Dayjs).refine(
        (value) => {
          return value.isValid();
        },
        { message: "invalid date" }
      ),
    ]),
    // endYearMonth: z.string().optional(),
    // endYearMonth: z.optional(
    endYearMonth: z.union([
      z.null(),
      z.string().refine(
        (value) => {
          return dayjs(value).isValid();
        },
        { message: "invalid date" }
      ),
      z.instanceof(dayjs as unknown as typeof dayjs.Dayjs).refine(
        (value) => {
          return value.isValid();
        },
        { message: "invalid date" }
      ),
    ]),
    // ),
    isPresent: z.boolean(),
    techStack: z.array(z.string()),
    summary: z.string().optional(),
    teamSize: z.preprocess(
      (value) => Number(value),
      z.number().int().positive().optional()
    ),
    isEditing: z.boolean(),
  })
  .refine(
    (args) => {
      return (
        (args.isPresent && !args.endYearMonth) ||
        (!args.isPresent && args.endYearMonth)
      );
    },
    // TODO: このメッセージが出力できていないため別途修正
    { message: "Only one for isPresent and endYearMonth can be entered." }
  );

export type Career = z.infer<typeof CareerSchema> & { id?: string };

export type TechStack = (typeof techStacks)[number];
