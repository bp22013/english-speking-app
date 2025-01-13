/* 管理者のメールアドレス変更バリデーションスキーマ */

import { z } from "zod";

export const inputs = z
  .object({
    email: z.string().email("有効なメールアドレスを入力してください").nonempty("メールアドレスは必須です"),
    confirmEmail: z.string().nonempty("メールアドレスの確認は必須です"),
  })
  .refine((data) => data.email === data.confirmEmail, {
    message: "メールアドレスが一致しません",
    path: ["confirmEmail"],
  });

export type InputsType = z.infer<typeof inputs>;
