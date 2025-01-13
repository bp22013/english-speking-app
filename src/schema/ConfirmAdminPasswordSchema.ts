/* 管理者のパスワード確認時バリデーションスキーマ */

import { z } from "zod";

export const inputs = z.object({
  password: z
    .string()
    .min(1,{message: "パスワードを入力してください"})
    .max(10,{message: "パスワードは10文字以下で入力してください"}),
});
export type InputsType = z.infer<typeof inputs>;
