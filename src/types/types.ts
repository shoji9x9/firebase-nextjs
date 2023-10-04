import dayjs from "dayjs";

export type PersonalInfo = {
  fullName: string;
  email: string;
  dateOfBirth: string | dayjs.Dayjs;
  zipCode: string;
  address: string;
};
