import { z } from "zod";

export const inputs = z.object({
  studentId: z
    .string()
    .min(1,{message: "生徒IDを入力してください"}),
  name: z
    .string()
    .min(1,{message: "名前を入力してください"})
    .max(100,{message: "名前は100文字以下で入力してください"}),
});
export type InputsType = z.infer<typeof inputs>;
