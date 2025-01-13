/* 管理者削除用ページ */

"use client";

import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Card, CardHeader, CardBody, Button, Divider, Spinner, useDisclosure } from '@nextui-org/react';
import { AdminNavigationbar } from '@/app/components/Navbar/AdminNavbar';
import { NextPage } from 'next';
import { useState, useEffect } from 'react';
import { DeleteConfirmationModal } from '@/app/components/Modal/DeleteConfirmModal';
import toast from 'react-hot-toast';

interface Admin {
    id: string;
    name: string;
    email: string;
    createdAt: string;
}

const AdminDeletePage: NextPage = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [admins, setAdmins] = useState<Admin[]>([]);
    const [adminId, setAdminId] =useState<string | null>(null);
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    // 管理者の情報を取得する関数
    const fetchAdminInformation = async () => {
        setIsLoading(true);
        try {
            const response = await fetch("/api/auth/delete/getInformation/admin", {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            });

            const data = await response.json();

            if (!response.ok) {
                toast.error(data.message || "管理者情報の取得に失敗しました。");
                return;
            }

            setAdmins(data.admins); // 管理者リストを設定
        } catch {
            toast.error("管理者情報の取得に失敗しました。");
        } finally {
            setIsLoading(false);
        }
    };

    // 管理者削除の関数
    const handleDeleteAdmin = async (adminId: string) => {
        setIsLoading(true);

        toast.promise(
            new Promise(async (resolve, reject) => {
                try {
                    const response = await fetch(`/api/auth/delete/deleteUser/admin`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ email: DeleteTargetAdmin }),
                    });

                    const data = await response.json();

                    if (!response.ok) {
                        reject(data.message || "管理者の削除に失敗しました。");
                        return;
                    }

                    resolve("管理者が削除されました。");
                    setAdmins((prev) => prev.filter((admin) => admin.id !== adminId)); // 削除後にリストを更新
                } catch {
                    reject("管理者の削除に失敗しました。");
                } finally {
                    setIsLoading(false);
                }
            }),
            {
                loading: "対象の管理者を削除中...",
                success: "対象の管理者が削除されました！",
                error: (message) => message,
            }
        );
    };

    const handleDeleteClick = (id: string) => {
        setAdminId(id);
        onOpen();
    };

    const confirmDelete = () => {
        if (adminId) {
            handleDeleteAdmin(adminId);
        }
        onOpenChange();
    };

    const selectedAdmin = adminId
        ? admins.find((n) => n.id === adminId)?.name || "この管理者"
        : "";

    const DeleteTargetAdmin = adminId
        ? admins.find((n) => n.id === adminId)?.email : "";

    // 初回レンダリング時にデータを取得
    useEffect(() => {
        fetchAdminInformation();
    }, []);

    return (
        <>
            <div className="bg-blue-100 min-h-screen flex flex-col">
                <AdminNavigationbar />
                <Card className="m-6 shadow-lg">
                    <CardHeader>
                        <h1 className="text-2xl font-bold text-gray-800">管理者の削除</h1>
                    </CardHeader>
                    <Divider />
                    <CardBody>
                        {isLoading ? (
                            <div className="flex justify-center items-center h-64">
                                <Spinner label="管理者情報を取得中..." color="success" />
                            </div>
                        ) : (
                            <Table aria-label="管理者の削除" shadow="none">
                                <TableHeader>
                                    <TableColumn>名前</TableColumn>
                                    <TableColumn>メールアドレス</TableColumn>
                                    <TableColumn>作成日時</TableColumn>
                                    <TableColumn>操作</TableColumn>
                                </TableHeader>
                                <TableBody>
                                    {admins.map((admin) => (
                                        <TableRow key={admin.id}>
                                            <TableCell>{admin.name || "未設定"}</TableCell>
                                            <TableCell>{admin.email}</TableCell>
                                            <TableCell>{new Date(admin.createdAt).toLocaleDateString()}</TableCell>
                                            <TableCell>
                                                <Button
                                                    color="danger"
                                                    size="sm"
                                                    onClick={() => handleDeleteClick(admin.id)}
                                                    disabled={isLoading}
                                                >
                                                    {isLoading ? "削除..." : "削除中"}
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                    </CardBody>
                </Card>
                <DeleteConfirmationModal
                    showFlag={isOpen}
                    ChangeFlag={onOpenChange}
                    onConfirm={confirmDelete}
                    message={selectedAdmin}
                    role="管理者"
                />
            </div>
        </>
    );
};

export default AdminDeletePage;
