/* お知らせ作成ページ */

"use client";

import { useState } from "react";
import { AdminNavigationbar } from "@/app/components/Navbar/AdminNavbar";
import { Button, Textarea } from "@nextui-org/react";
import { AdminUseAuth } from "@/hooks/useAuth/AdminUseAuth";
import toast from "react-hot-toast";

export default function CreateNotification() {
    const [message, setMessage] = useState("");
    const loginuser = AdminUseAuth();

    // 通知を作成する
    const createNotification = async () => {

        if (!message.trim()) {
            toast.error("通知メッセージを入力してください。");
            return;
        }

        // トーストを表示しながら非同期処理を実行
        await toast.promise(
            fetch("/api/notification/MakeNotification", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ message, email: loginuser.email }),
            })
                .then(async (response) => {
                    if (!response.ok) {
                        const error = await response.json();
                        throw new Error(error.error || "通知の送信に失敗しました。");
                    }
                    setMessage(""); // 成功時にメッセージをクリア
                })
                .catch((error) => {
                    throw new Error(error.message || "エラーが発生しました。");
                }),
            {
                loading: "通知を送信中です...",
                success: "通知が正常に送信されました。",
                error: (err) => err.message || "通知の送信に失敗しました。",
            }
        );
    };

    return (
        <div className="bg-blue-100 min-h-screen flex flex-col">
            <AdminNavigationbar />
            <div className="mt-20 flex justify-center">
                <div className="w-[90%] sm:w-[70%] lg:w-[50%] flex flex-col items-center bg-white shadow-lg p-6 rounded-lg">
                    <h1 className="text-2xl font-bold mb-6">お知らせ作成</h1>
                    <Textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="通知メッセージを入力してください"
                        rows={5}
                        className="w-full mb-4 text-base"
                    />
                    <Button
                        onClick={createNotification}
                        className="w-full bg-gradient-to-r from-blue-500 to-blue-700 text-white py-3 rounded-md"
                    >
                        通知を送信
                    </Button>
                </div>
            </div>
        </div>
    );
}
