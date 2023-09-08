import { object, number } from "yup";

export const schema = object({
  heightCone: number().required().positive(),
  raduisCone: number().required().positive(),
  numberSegmentsCone: number().required().positive(),
});
