/* 管理者用ログインフォームのバリデーションスキーマ */

import { z } from "zod";

export const inputs = z.object({
  email: z
    .string()
    .min(1,{message: "メールアドレスを入力してください"})
    .max(100,{message: "100文字以内で入力してください"})
    .email({message: "メールアドレスの形式で入力してください"}),
  password: z
    .string()
    .min(1,{message: "パスワードを入力してください"})
    .max(10,{message: "パスワードは10文字以下で入力してください"}),
});
export type InputsType = z.infer<typeof inputs>;
