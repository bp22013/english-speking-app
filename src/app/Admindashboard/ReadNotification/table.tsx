/* テーブルコンポーネント */

'use client';

import { useState } from "react";
import { Table, Button, TableCell, TableBody, TableRow, TableColumn, TableHeader } from "@nextui-org/react";

type Notification = {
    id: string;
    message: string;
    isRead: boolean;
    createdAt: string;
};

type NotificationTableProps = {
    notifications: Notification[];
    markAsRead: (notificationId: string) => Promise<void>;
    updateNotification: (notificationId: string) => Promise<void>; // 削除用関数を追加
};

export default function NotificationTable({
    notifications,
    markAsRead,
    updateNotification,
}: NotificationTableProps) {
    const [loadingId, setLoadingId] = useState<string | null>(null);

    const handleMarkAsRead = async (notificationId: string) => {
        setLoadingId(notificationId);
        await markAsRead(notificationId);
        setLoadingId(null);
    };

    const handleDeleteNotification = async (notificationId: string) => {
        setLoadingId(notificationId);
        await updateNotification(notificationId);
        setLoadingId(null);
    };

    return (
        <Table aria-label="通知一覧" style={{ height: "auto", minWidth: "100%" }} shadow="sm">
            <TableHeader>
                <TableColumn>通知時間</TableColumn>
                <TableColumn>メッセージ</TableColumn>
                <TableColumn>ステータス</TableColumn>
                <TableColumn>操作</TableColumn>
            </TableHeader>
            <TableBody emptyContent={"通知はありません"}>
                {notifications.map((notification) => (
                    <TableRow key={notification.id}>
                        <TableCell>{new Date(notification.createdAt).toLocaleString()}</TableCell>
                        <TableCell>{notification.message}</TableCell>
                        <TableCell>
                            {!notification.isRead && (
                                <Button
                                    size="sm"
                                    color="primary"
                                    onClick={() => handleMarkAsRead(notification.id)}
                                    disabled={loadingId === notification.id}
                                >
                                    {loadingId === notification.id ? "処理中..." : "既読にする"}
                                </Button>
                            )}
                            <Button
                                size="sm"
                                color="danger"
                                onClick={() => handleDeleteNotification(notification.id)}
                                disabled={loadingId === notification.id}
                                className="ml-2"
                            >
                                {loadingId === notification.id ? "処理中..." : "削除"}
                            </Button>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}
