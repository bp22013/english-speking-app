/* お知らせ作成ページ */

"use client";

import { useState } from "react";
import { AdminNavigationbar } from "@/app/components/Navbar/AdminNavbar";

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
        <div>
            <div className="bg-blue-100 min-h-screen flex flex-col">
                <AdminNavigationbar/>
                <h1>通知作成</h1>
                <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="通知メッセージを入力してください"
                        rows={5}
                        style={{
                            width: "100%",
                            marginBottom: "1rem",
                            padding: "0.5rem",
                            fontSize: "1rem",
                        }}
                />
                <button
                    onClick={createNotification}
                    style={{
                        padding: "0.5rem 1rem",
                        backgroundColor: "#0070f3",
                        color: "white",
                        border: "none",
                        cursor: "pointer",
                        borderRadius: "4px",
                    }}
                >
                    通知を送信
                </button>
                {status && (
                    <p
                        style={{
                            marginTop: "1rem",
                            color: status.startsWith("エラー") ? "red" : "green",
                        }}
                    >
                        {status}
                    </p>
                )}
            </div>
        </div>
    );
}
