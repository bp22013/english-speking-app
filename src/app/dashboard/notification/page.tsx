/* 通知取得ページ */

"use client";

import { useEffect, useState } from "react";
import { StudentNavigationbar } from "@/app/components/Navbar/StudentNavbar";
import { StudentUseAuth } from "@/hooks/useAuth/StudentUseAuth";
import { Pagination, Spinner } from "@nextui-org/react";
import toast from "react-hot-toast";
import NotificationTable from "./table";

type Notification = {
    id: string; // 修正: notificationId を string 型に
    message: string;
    isRead: boolean;
    createdAt: string;
};

export default function NotificationPage() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const loginuser = StudentUseAuth();
    const itemsPerPage = 10; // 1ページあたりの通知件数

    // 通知を取得する関数
    const fetchNotifications = async (page: number) => {
        setIsLoading(true);
        try {
            const response = await fetch("/api/notification/GetNotification", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    studentId: loginuser.studentId,
                    page,
                    limit: itemsPerPage,
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to fetch notifications");
            }

            const data = await response.json();
            setNotifications(data.notifications || []);
            setTotalPages(data.totalPages || 1);
        } catch (error) {
            console.error("Error fetching notifications:", error);
            toast.error("通知の取得に失敗しました。");
            setNotifications([]);
        } finally {
            setIsLoading(false);
        }
    };

    // 通知を既読にする関数
    const markAsRead = async (notificationId: string) => { // 修正: notificationId 型を string に変更
        try {
            const response = await fetch("/api/notification/MarkNotification", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ notificationId, studentId: loginuser.studentId }),
            });

            const data = await response.json();
            if (response.ok) {
                toast.success(data.message);
                fetchNotifications(currentPage);
            } else {
                toast.error(data.error);
            }
        } catch {
            toast.error("不明なエラーが発生しました");
        }
    };

    // 初回マウント時に通知を取得
    useEffect(() => {
        if (loginuser.studentId) {
            fetchNotifications(currentPage);
        }
    }, [loginuser.studentId, currentPage]);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    return (
        <div className="bg-blue-100 min-h-screen flex flex-col">
            <StudentNavigationbar />
            <div className="container mx-auto p-4">
                <h1 className="text-2xl font-bold mb-4">通知一覧</h1>
                {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                        <Spinner label="通知を取得中です..." color="success" />
                    </div>
                ) : (
                    <>
                        <NotificationTable
                            notifications={notifications}
                            markAsRead={markAsRead}
                        />
                        <div className="mt-4 flex justify-center">
                            <Pagination
                                total={totalPages}
                                initialPage={currentPage}
                                color="secondary"
                                onChange={handlePageChange}
                            />
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
