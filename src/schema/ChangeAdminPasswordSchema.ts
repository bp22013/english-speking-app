import { z } from "zod";

export const inputs = z
  .object({
    password: z.string().nonempty("パスワードは必須です"),
    confirmPassword: z.string().nonempty("パスワードの確認は必須です"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "パスワードが一致しません",
    path: ["confirmPassword"],
  });

export type InputsType = z.infer<typeof inputs>;
