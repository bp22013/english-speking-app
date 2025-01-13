/* 生徒削除用ページ */

"use client";

import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Card, CardHeader, CardBody, Button, Divider, Spinner, useDisclosure } from '@nextui-org/react';
import { AdminNavigationbar } from '@/app/components/Navbar/AdminNavbar';
import { NextPage } from 'next';
import { useState, useEffect } from 'react';
import { DeleteConfirmationModal } from '@/app/components/Modal/DeleteConfirmModal';
import toast from 'react-hot-toast';

interface Student {
    id: string;
    name: string;
    studentId: string;
    createdAt: string;
}

const StudentDeletePage: NextPage = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [students, setStudents] = useState<Student[]>([]);
    const [studentId, setStudentId] =useState<string | null>(null);
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    // 生徒の情報を取得する関数
    const fetchStudentInformation = async () => {
        setIsLoading(true);
        try {
            const response = await fetch("/api/auth/delete/getInformation/student", {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            });

            const data = await response.json();

            if (!response.ok) {
                toast.error(data.error || "生徒情報の取得に失敗しました。");
                return;
            }

            setStudents(data.students); // 生徒リストを設定
        } catch {
            toast.error("生徒情報の取得に失敗しました。");
        } finally {
            setIsLoading(false);
        }
    };

    // 生徒削除の関数
    const handleDeleteStudent = async (studentId: string) => {
        setIsLoading(true);

        toast.promise(
            new Promise(async (resolve, reject) => {
                try {
                    const response = await fetch(`/api/auth/delete/deleteUser/student`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ studentId }),
                    });

                    const data = await response.json();

                    if (!response.ok) {
                        reject(data.message);
                        return;
                    }

                    resolve("生徒が削除されました。");
                    setStudents((prev) => prev.filter((student) => student.id !== studentId)); // 削除後にリストを更新
                } catch {
                    reject("生徒の削除に失敗しました。");
                } finally {
                    setIsLoading(false);
                }
            }),
            {
                loading: "対象の生徒を削除中...",
                success: "対象の生徒が削除されました！",
                error: (message) => message,
            }
        );
    };

    const handleDeleteClick = (id: string) => {
        setStudentId(id);
        onOpen();
    };

    const confirmDelete = () => {
        if (studentId) {
            handleDeleteStudent(studentId);
        }
        onOpenChange();
    };

    const selectedStudentMessage = studentId
        ? students.find((n) => n.id === studentId)?.name || "この学生"
        : "";
    
    // 初回レンダリング時にデータを取得
    useEffect(() => {
        fetchStudentInformation();
    }, []);

    return (
        <>
            <div className="bg-blue-100 min-h-screen flex flex-col">
                <AdminNavigationbar />
                <Card className="m-6 shadow-lg">
                    <CardHeader>
                        <h1 className="text-2xl font-bold text-gray-800">生徒の削除</h1>
                    </CardHeader>
                    <Divider />
                    <CardBody>
                        {isLoading ? (
                            <div className="flex justify-center items-center h-64">
                                <Spinner label="生徒情報を取得中..." color="success" />
                            </div>
                        ) : (
                            <Table aria-label="生徒の削除" shadow="none">
                                <TableHeader>
                                    <TableColumn>名前</TableColumn>
                                    <TableColumn>生徒ID</TableColumn>
                                    <TableColumn>作成日時</TableColumn>
                                    <TableColumn>操作</TableColumn>
                                </TableHeader>
                                <TableBody emptyContent="生徒が存在しません">
                                    {students.map((student) => (
                                        <TableRow key={student.id}>
                                            <TableCell>{student.name || "未設定"}</TableCell>
                                            <TableCell>{student.studentId}</TableCell>
                                            <TableCell>{new Date(student.createdAt).toLocaleDateString()}</TableCell>
                                            <TableCell>
                                                <Button
                                                    color="danger"
                                                    size="sm"
                                                    onClick={() => handleDeleteClick(student.id)}
                                                    disabled={isLoading}
                                                >
                                                    削除
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
                    message={selectedStudentMessage}
                    role="生徒"
                />
            </div>
        </>
    );
};

export default StudentDeletePage;
