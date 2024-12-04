/* テーブルコンポーネント */

'use client';

import { useState } from "react";
import { Table, Button, TableCell, TableBody, TableRow, TableColumn, TableHeader, Chip } from "@nextui-org/react";

type Notification = {
    id: number;
    message: string;
    isRead: boolean;
    createdAt: string;
};

type NotificationTableProps = {
    notifications: Notification[];
    markAsRead: (notificationId: number) => Promise<void>;
};

export default function NotificationTable({
    notifications,
    markAsRead,
}: NotificationTableProps) {
    const [loadingId, setLoadingId] = useState<number | null>(null); // 処理中の通知IDを管理

    const handleMarkAsRead = async (notificationId: number) => {
        setLoadingId(notificationId); // 処理中の通知IDを設定
        await markAsRead(notificationId); // 通知を既読にする処理
        setLoadingId(null); // 処理完了後にリセット
    };

    return (
        <Table
            aria-label="通知一覧"
            style={{ height: "auto", minWidth: "100%" }}
            shadow="sm"
        >
            <TableHeader>
                <TableColumn>通知時間</TableColumn>
                <TableColumn>メッセージ</TableColumn>
                <TableColumn>ステータス</TableColumn>
                <TableColumn>操作</TableColumn>
            </TableHeader>
            <TableBody emptyContent={"通知はありません"}>
                {notifications.map((notification) => (
                    <TableRow key={notification.id}>
                        <TableCell>
                            {new Date(notification.createdAt).toLocaleString()}
                        </TableCell>
                        <TableCell>{notification.message}</TableCell>
                        <TableCell>
                            <Chip
                                variant="flat"
                                color={notification.isRead ? "success" : "warning"} // 状態に応じて色を変更
                            >
                                {notification.isRead ? "既読" : "未読"}
                            </Chip>
                        </TableCell>
                        <TableCell>
                            {!notification.isRead && (
                                <Button
                                    size="sm"
                                    color="primary"
                                    onClick={() => handleMarkAsRead(notification.id)}
                                    disabled={loadingId === notification.id} // 処理中ならボタンを無効化
                                >
                                    {loadingId === notification.id ? "処理中..." : "既読にする"}
                                </Button>
                            )}
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}
