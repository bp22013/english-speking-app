/* お知らせ作成ページ */

'use client';

import { useEffect, useState } from "react";
import { AdminNavigationbar } from "@/app/components/Navbar/AdminNavbar";
import { Pagination, Textarea, Spinner, Button, Table, TableHeader, TableBody, TableRow, TableCell, TableColumn, Input, useDisclosure } from "@nextui-org/react";
import { Divider, Card, CardHeader, CardBody } from "@nextui-org/react";
import toast from "react-hot-toast";
import { AdminUseAuth } from "@/hooks/useAuth/AdminUseAuth";
import { DeleteConfirmationModal } from "@/app/components/Modal/DeleteConfirmModal";
import { NextPage } from "next";

type Notification = {
    id: string;
    message: string;
    isRead: boolean;
    createdAt: string;
};

const NotificationPage: NextPage = () => {
    const [message, setMessage] = useState("");
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isDeleting, setIsDeleting] = useState<boolean>(false);
    const [isUpdating, setIsUpdating] = useState<boolean>(false);
    const [editingNotificationId, setEditingNotificationId] = useState<string | null>(null);
    const [newMessage, setNewMessage] = useState<string>("");
    const [selectedNotificationId, setSelectedNotificationId] = useState<string | null>(null);
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    const itemsPerPage = 10;
    const loginuser = AdminUseAuth();

    // 通知を作成する関数
    const createNotification = async () => {
        setIsLoading(true);

        toast.promise(
            new Promise(async (resolve, reject) => {
                if (!message.trim()) {
                    reject("通知メッセージを入力してください。");
                    return;
                }

                try {
                    const response = await fetch("/api/notification/MakeNotification", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ message, email: loginuser.email }),
                    });

                    const data = await response.json();
                    if (!response.ok) {
                        reject(data.error);
                    }

                    resolve("通知が正常に送信されました！");
                    setMessage("");
                    fetchNotifications(currentPage);
                } catch {
                    reject("通知の送信に失敗しました。");
                } finally {
                    setIsLoading(false);
                }
            }),
            {
                loading: "通知を送信中です...",
                success: "通知が正常に送信されました！",
                error: (message) => message,
            }
        );
    };


    //通知を取得する関数
    const fetchNotifications = async (page: number) => {
        setIsLoading(true);
        try {
            const response = await fetch("/api/notification/GetNotification/admin", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: loginuser.email, page, limit: itemsPerPage }),
            });

            const data = await response.json();

            if (!response.ok) {
                toast.error(data.error);
            }

            setNotifications(data.notifications || []);
            setTotalPages(data.totalPages || 1);
        } catch {
            toast.error("通知の取得に失敗しました。");
            setNotifications([]);
        } finally {
            setIsLoading(false);
        }
    };

    //通知を更新する関数
    const updateNotification = async (notificationId: string, updatedMessage: string) => {
        setIsUpdating(true);

        toast.promise(
            new Promise(async (resolve, reject) => {
                if (!updatedMessage.trim()) {
                    reject("メッセージを入力してください。");
                    return;
                }

                try {
                    const response = await fetch("/api/notification/UpdateNotification", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ notificationId, message: updatedMessage, email: loginuser.email }),
                    });

                    const data = await response.json();
                    if (!response.ok) {
                        reject(data.error);
                    };

                    resolve(data.message);
                    setEditingNotificationId(null);
                    fetchNotifications(currentPage);
                } catch {
                    reject("通知の更新に失敗しました。");
                } finally {
                    setIsUpdating(false);
                }
            }),
            {
                loading: "通知を更新中...",
                success: "通知が更新されました！",
                error: (message) => message,
            }
        );
    };

    //通知を削除する関数
    const deleteNotification = async (notificationId: string) => {
        setIsDeleting(true);

        toast.promise(
            new Promise(async (resolve, reject) => {
                try {
                    const response = await fetch("/api/notification/DeleteNotification", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ notificationId, email: loginuser.email }),
                    });

                    const data = await response.json();
                    if (!response.ok) {
                        reject(data.error);
                    };

                    resolve(data.message);
                    fetchNotifications(currentPage);
                } catch {
                    reject("通知の削除に失敗しました。");
                } finally {
                    setIsDeleting(false);
                }
            }),
            {
                loading: "通知を削除中...",
                success: "通知が削除されました！",
                error: (message) => message,
            }
        );
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

    const handleCancelClick = () => {
        setEditingNotificationId(null);
        setNewMessage("");
    };

    const handleDeleteClick = (notificationId: string) => {
        setSelectedNotificationId(notificationId);
        onOpen();
    };

    const confirmDelete = () => {
        if (selectedNotificationId) {
            deleteNotification(selectedNotificationId);
        }
        onOpenChange();
    };

    const handlePageChange = (page: number) => setCurrentPage(page);

    const selectedNotificationMessage = selectedNotificationId
        ? notifications.find((n) => n.id === selectedNotificationId)?.message || "この通知"
        : "";

    useEffect(() => {
        if (loginuser.email) fetchNotifications(currentPage);
    }, [loginuser.email, currentPage]);

    return (
        <div className="bg-blue-100 min-h-screen flex flex-col">
            <AdminNavigationbar />
            <div className="flex flex-wrap gap-6 justify-center items-start mt-10 mx-auto max-w-7xl">
                <Card className="shadow-md p-6 flex-1 min-w-[850px]">
                    <CardHeader className="flex justify-between items-center">
                        <h1 className="text-2xl font-bold text-gray-800">通知一覧</h1>
                    </CardHeader>
                    <Divider />
                    <CardBody>
                        {isLoading ? (
                            <div className="flex justify-center items-center h-64">
                                <Spinner label="通知を取得中..." color="success" />
                            </div>
                        ) : (
                            <>
                                <Table aria-label="通知一覧" shadow="none">
                                    <TableHeader>
                                        <TableColumn>メッセージ</TableColumn>
                                        <TableColumn>作成日時</TableColumn>
                                        <TableColumn>操作</TableColumn>
                                    </TableHeader>
                                    <TableBody emptyContent="通知はありません">
                                        {notifications.map((notification) => (
                                            <TableRow key={notification.id}>
                                                <TableCell>
                                                    {editingNotificationId === notification.id ? (
                                                        <Input
                                                            value={newMessage}
                                                            onChange={(e) => setNewMessage(e.target.value)}
                                                        />
                                                    ) : (
                                                        notification.message
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    {new Date(notification.createdAt).toLocaleString()}
                                                </TableCell>
                                                <TableCell>
                                                    {editingNotificationId === notification.id ? (
                                                        <div className="flex gap-2">
                                                            <Button
                                                                size="sm"
                                                                color="success"
                                                                onClick={() => handleSaveClick(notification.id)}
                                                                isDisabled={isUpdating}
                                                            >
                                                                {isUpdating ? "更新中..." : "更新"}
                                                            </Button>
                                                            <Button
                                                                size="sm"
                                                                color="warning"
                                                                onClick={handleCancelClick}
                                                            >
                                                                キャンセル
                                                            </Button>
                                                        </div>
                                                    ) : (
                                                        <div className="flex gap-2">
                                                            <Button
                                                                size="sm"
                                                                color="secondary"
                                                                onClick={() => handleUpdateClick(notification)}
                                                            >
                                                                編集
                                                            </Button>
                                                            <Button
                                                                size="sm"
                                                                color="danger"
                                                                onClick={() => handleDeleteClick(notification.id)}
                                                                isDisabled={isDeleting}
                                                            >
                                                                削除
                                                            </Button>
                                                        </div>
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                                <div className="mt-6 flex justify-center">
                                    <Pagination
                                        total={totalPages}
                                        page={currentPage}
                                        onChange={handlePageChange}
                                        color="secondary"
                                    />
                                </div>
                            </>
                        )}
                    </CardBody>
                </Card>
                <Card className="shadow-md p-6 flex-1 min-w-[400px]">
                    <CardHeader>
                        <h1 className="text-2xl font-bold text-gray-800">お知らせ作成</h1>
                    </CardHeader>
                    <Divider />
                    <CardBody className="flex flex-col gap-4">
                        <Textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="新しい通知メッセージを入力してください"
                            rows={5}
                        />
                        <Button color="primary" onClick={createNotification}>
                            通知を送信
                        </Button>
                    </CardBody>
                </Card>
            </div>
            <DeleteConfirmationModal
                showFlag={isOpen}
                ChangeFlag={onOpenChange}
                onConfirm={confirmDelete}
                message={selectedNotificationMessage}
                role="通知"
            />
        </div>
    );
}

export default NotificationPage;