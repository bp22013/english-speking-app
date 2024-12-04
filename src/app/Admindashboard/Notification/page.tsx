/* お知らせ作成ページ */

"use client";

import { useState } from "react";
import { AdminNavigationbar } from "@/app/components/Navbar/AdminNavbar";
import { Button, Textarea } from "@nextui-org/react";

export default function CreateNotification() {
    const [message, setMessage] = useState("");
    const [status, setStatus] = useState<string | null>(null);

    // 通知を作成する
    const createNotification = async () => {
        if (!message.trim()) {
            setStatus("通知メッセージを入力してください。");
            return;
        }

        try {
            const response = await fetch("/api/notification/MakeNotification", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ message }),
            });

            if (response.ok) {
                setMessage(""); // フォームをクリア
                setStatus("通知が正常に送信されました。");
            } else {
                const error = await response.json();
                setStatus(`エラー: ${error.error || "通知の送信に失敗しました。"}`);
            }
        } catch {
            setStatus("エラーが発生しました。もう一度お試しください。");
        }
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
                    {status && (
                        <p
                            className={`mt-4 text-center ${
                                status.startsWith("エラー") ? "text-red-500" : "text-green-500"
                            }`}
                        >
                            {status}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
