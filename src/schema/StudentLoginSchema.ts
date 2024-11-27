import { z } from "zod";

export const inputs = z.object({
  studentId: z
    .string()
    .min(1,{message: "生徒IDを入力してください"}),
  password: z
    .string()
    .min(1,{message: "パスワードを入力してください"})
    .max(10,{message: "パスワードは10文字以下で入力してください"}),
});
export type InputsType = z.infer<typeof inputs>;
