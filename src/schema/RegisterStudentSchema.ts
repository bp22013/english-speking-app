import { z } from "zod";

export const inputs = z.object({
  studentId: z
    .string()
    .min(1,{message: "生徒IDを入力してください"})
    .max(20,{message: "生徒IDは20文字以内で入力してください"}),
  name: z
    .string()
    .min(1,{message: "名前を入力してください"})
    .max(100,{message: "名前は100文字以内で入力してください"}),
  password: z
    .string()
    .min(1,{message: "パスワードを入力してください"})
    .max(10,{message: "パスワードは10文字以内で入力してください"}),
});
export type InputsType = z.infer<typeof inputs>;
