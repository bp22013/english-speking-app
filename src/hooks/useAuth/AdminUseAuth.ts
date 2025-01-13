/* 管理者用トークン有効性チェックフック */

"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export const AdminUseAuth = () => {
    const [loginUser, setLoginUser] = useState({
        email: "",
        exp: 0,
        username: "",
    });
    const router = useRouter();

    // トーストIDを追跡する
    const [toastId, setToastId] = useState<string | null>(null);

    useEffect(() => {
        const checkToken = async () => {
            try {
                // サーバーサイドのエンドポイントを呼び出す
                const response = await fetch("/api/auth/checkToken/admin", {
                    method: "GET",
                    credentials: "include",
                });

                if (response.ok) {
                    // サーバーからユーザー情報を取得してセット
                    const data = await response.json();
                    setLoginUser(data.user);
                } else {
                    // トークンが無効の場合、既存トーストを閉じてから新しいトーストを表示
                    if (!toastId) {
                        const id = toast.error("トークンが無効です。ログインしてください。", {
                            id: "auth-error", // 固定のIDを設定して重複を防ぐ
                        });
                        setToastId(id); // トーストIDを保存
                    }
                    router.push("/");
                    router.refresh();
                }
            } catch (error) {
                if (!toastId) {
                    const id = toast.error("認証エラーが発生しました: " + error, {
                        id: "auth-error", // 固定のIDを設定して重複を防ぐ
                    });
                    setToastId(id); // トーストIDを保存
                }
                router.push("/");
                router.refresh();
            }
        };

        checkToken();
    }, [router, toastId]);

    return loginUser;
};
