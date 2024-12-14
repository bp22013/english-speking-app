/* 通知取得ページ */

"use client";

import { useEffect, useState } from "react";
import { AdminNavigationbar } from "@/app/components/Navbar/AdminNavbar";
import { AdminUseAuth } from "@/hooks/useAuth/AdminUseAuth";
import { Pagination, Spinner, Input, Button, Table, TableCell, TableRow, TableBody, TableColumn, TableHeader } from "@nextui-org/react";
import toast from "react-hot-toast";

type Notification = {
    id: string;
    message: string;
    isRead: boolean;
    createdAt: string;
};

export default function ReadNotificationPage() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [editingNotificationId, setEditingNotificationId] = useState<string | null>(null);
    const [newMessage, setNewMessage] = useState<string>("");
    const loginuser = AdminUseAuth();
    const itemsPerPage = 10;

    const fetchNotifications = async (page: number) => {
        setIsLoading(true);
        try {
            const response = await fetch("/api/notification/GetNotification/admin", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: loginuser.email, page, limit: itemsPerPage }),
            });

            if (!response.ok) throw new Error("エラーが発生しました");

            const data = await response.json();
            setNotifications(data.notifications || []);
            setTotalPages(data.totalPages || 1);
        } catch {
            toast.error("通知の取得に失敗しました。");
            setNotifications([]);
        } finally {
            setIsLoading(false);
        }
    };

    const markAsRead = async (notificationId: string) => {
        try {
            const response = await fetch("/api/notification/MarkNotification/admin", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ notificationId, email: loginuser.email }),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.error);

            toast.success(data.message);
            fetchNotifications(currentPage);
        } catch {
            toast.error("不明なエラーが発生しました");
        }
    };

    const updateNotification = async (notificationId: string, updatedMessage: string) => {
        try {
            const response = await fetch("/api/notification/UpdateNotification", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ notificationId, message: updatedMessage, email: loginuser.email }),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.error);

            toast.success(data.message);
            setEditingNotificationId(null);
            fetchNotifications(currentPage);
        } catch {
            toast.error("通知の更新に失敗しました。");
        }
    };

    const deleteNotification = async (notificationId: string) => {
        try {
            const response = await fetch("/api/notification/DeleteNotification", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ notificationId, email: loginuser.email }),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.error);

            toast.success(data.message);
            fetchNotifications(currentPage);
        } catch {
            toast.error("通知の削除に失敗しました。");
        }
    };

    const handleUpdateClick = (notification: Notification) => {
        setEditingNotificationId(notification.id);
        setNewMessage(notification.message);
    };

    const handleSaveClick = (notificationId: string) => {
        if (newMessage.trim() === "") {
            toast.error("メッセージは空にできません。");
            return;
        }
        updateNotification(notificationId, newMessage);
    };

    const handleDeleteClick = (notificationId: string) => {
        if (window.confirm("この通知を削除しますか？")) {
            deleteNotification(notificationId);
        }
    };

    const handleMarkAsReadClick = (notificationId: string) => {
        markAsRead(notificationId);
    };

    const handlePageChange = (page: number) => setCurrentPage(page);

    useEffect(() => {
        if (loginuser.email) fetchNotifications(currentPage);
    }, [loginuser.email, currentPage]);

    return (
        <div className="bg-blue-100 min-h-screen flex flex-col">
            <AdminNavigationbar />
            <div className="container mx-auto p-4">
                <h1 className="text-2xl font-bold mb-4">通知一覧</h1>
                {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                        <Spinner label="通知を取得中です..." color="success" />
                    </div>
                ) : (
                    <>
                        <Table
                            aria-label="通知一覧"
                            style={{ height: "auto", minWidth: "100%" }}
                            shadow="none"
                        >
                            <TableHeader>
                                <TableColumn>メッセージ</TableColumn>
                                <TableColumn>作成日時</TableColumn>
                                <TableColumn>既読</TableColumn>
                                <TableColumn>操作</TableColumn>
                            </TableHeader>
                            <TableBody>
                                {notifications.map((notification) => (
                                    <TableRow key={notification.id}>
                                        <TableCell>
                                            {editingNotificationId === notification.id ? (
                                                <Input
                                                    value={newMessage}
                                                    onChange={(e) => setNewMessage(e.target.value)}
                                                    aria-label="通知メッセージ編集"
                                                />
                                            ) : (
                                                notification.message
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            {new Date(notification.createdAt).toLocaleString()}
                                        </TableCell>
                                        <TableCell>
                                            {notification.isRead ? "✔" : "未読"}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex gap-2">
                                                {editingNotificationId === notification.id ? (
                                                    <Button
                                                        size="sm"
                                                        color="success"
                                                        onClick={() => handleSaveClick(notification.id)}
                                                    >
                                                        保存
                                                    </Button>
                                                ) : (
                                                    <Button
                                                        size="sm"
                                                        color="secondary"
                                                        onClick={() => handleUpdateClick(notification)}
                                                    >
                                                        更新
                                                    </Button>
                                                )}
                                                {!notification.isRead && (
                                                    <Button
                                                        size="sm"
                                                        color="primary"
                                                        onClick={() => handleMarkAsReadClick(notification.id)}
                                                    >
                                                        既読にする
                                                    </Button>
                                                )}
                                                <Button
                                                    size="sm"
                                                    color="danger"
                                                    onClick={() => handleDeleteClick(notification.id)}
                                                >
                                                    削除
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
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
