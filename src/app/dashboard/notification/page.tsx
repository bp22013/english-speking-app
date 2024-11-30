/* 通知取得ページ */

"use client";

import { useEffect, useState } from "react";
import { StudentNavigationbar } from "@/app/components/Navbar/StudentNavbar";
import { StudentUseAuth } from "@/hooks/useAuth/StudentUseAuth";
import toast from "react-hot-toast";

type Notification = {
    id: number;
    message: string;
    isRead: boolean;
    createdAt: string;
};

export default function NotificationPage() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const loginuser = StudentUseAuth();

    // 通知を取得する関数
    const fetchNotifications = async () => {
        try {
            const response = await fetch("/api/notification/GetNotification", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    studentId: loginuser.studentId,
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to fetch notifications");
            }

            const data = await response.json();
            setNotifications(data || []); // データが空の場合に空配列をセット
        } catch (error) {
            console.error("Error fetching notifications:", error);
            toast.error("通知の取得に失敗しました。");
            setNotifications([]); // エラー時に空配列をセット
        }
    };

    // コンポーネントの初回マウント時に通知を取得
    useEffect(() => {
        if (loginuser.studentId) {
            fetchNotifications();
        }
    }, [loginuser.studentId]);

    // 通知を既読にする関数
    async function markAsRead(notificationId: number, studentId: string) {
        try {
            const response = await fetch("/api/notification/MarkNotification", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ notificationId, studentId }), // 通知IDと生徒IDを送信
            });
    
            const data = await response.json();
            if (response.ok) {
                toast.success(data.message);
                // 通知一覧を再取得するなど、状態を更新する処理を追加可能
            } else {
                toast.error(data.error);
            }
        } catch {
            toast.error("不明なエラーが発生しました");
        }
    }
    

    return (
        <div className="bg-blue-100 min-h-screen flex flex-col">
            <StudentNavigationbar />
            <h1>通知一覧</h1>
            <ul>
                {Array.isArray(notifications) && notifications.length > 0 ? (
                    notifications.map((notification) => (
                        <li key={notification.id} style={{ marginBottom: "1rem" }}>
                            <p>{notification.message}</p>
                            <p>
                                {notification.isRead ? "既読" : "未読"} -{" "}
                                {new Date(notification.createdAt).toLocaleString()}
                            </p>
                            {!notification.isRead && (
                                <button onClick={() => markAsRead(notification.id, loginuser.studentId)}>既読にする</button>
                            )}
                        </li>
                    ))
                ) : (
                    <p>通知がありません。</p>
                )}
            </ul>
        </div>
    );
}
