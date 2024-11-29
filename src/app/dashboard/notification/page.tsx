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

    // 通知を取得する
    useEffect(() => {
        const fetchNotifications = async () => {
            const response = await fetch("/api/notification/GetNotification",{
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    studentId: loginuser.studentId,
                }),
            });
            const data = await response.json();
            setNotifications(data);
        };

        fetchNotifications();
    }, [loginuser.studentId]);

    // 通知を既読にする
    async function markAsRead(notificationId, studentId) {
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
                toast.success("Success:", data.message);
            } else {
                toast.error("Error:", data.error);
            }
        } catch (error) {
            toast.error("Network error:", error);
        }
    }
      

    return (
        <div className="bg-blue-100 min-h-screen flex flex-col">
            <StudentNavigationbar/>
            <h1>通知一覧</h1>
            <ul>
            {notifications.map((notification) => (
                <li key={notification.id} style={{ marginBottom: "1rem" }}>
                    <p>{notification.message}</p>
                    <p>
                        {notification.isRead ? "既読" : "未読"} -{" "}
                        {new Date(notification.createdAt).toLocaleString()}
                    </p>
                    {!notification.isRead && (
                        <button onClick={() => markAsRead(notification.id)}>既読にする</button>
                    )}
                </li>
            ))}
            </ul>
        </div>
    );
}
