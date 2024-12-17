/* 問題を作成するページ */

'use client';

import React, { useEffect, useState } from "react";
import { Table, Button, Input, Card, CardHeader, CardBody, Divider, 
         TableHeader, TableColumn, TableBody, TableRow, TableCell, Spinner, Pagination } from "@nextui-org/react";
import toast from "react-hot-toast";
import { AdminNavigationbar } from "@/app/components/Navbar/AdminNavbar";
import { AdminUseAuth } from "@/hooks/useAuth/AdminUseAuth";

interface Question {
    id: string;
    text: string;
    correctAnswer: string;
    createdAt: string;
    adminName: string;
}

const ManageQuestionsPage = () => {
    const [questions, setQuestions] = useState<Question[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isAdding, setIsAdding] = useState<boolean>(false);
    const [isDeleting, setIsDeleting] = useState<boolean>(false);
    const [isUpdating, setIsUpdating] = useState<boolean>(false);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [text, setText] = useState("");
    const [correctAnswer, setCorrectAnswer] = useState("");
    const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null);
    const [newText, setNewText] = useState<string>("");
    const [newCorrectAnswer, setNewCorrectAnswer] = useState<string>("");
    const admin = AdminUseAuth();
    const itemsPerPage = 10;

    // 問題リストを取得する関数
    const fetchQuestions = async (page: number) => {
        setIsLoading(true);
        try {
            const res = await fetch("/api/training/MakeQuestion/GetQuestion", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ page, limit: itemsPerPage }),
            });
            const data = await res.json();

            if (!res.ok) {
                toast.error(data.error || "データの取得に失敗しました");
            }

            setQuestions(data.questions);
            setTotalPages(data.totalPages || 1);
        } catch {
            toast.error("問題リストの取得に失敗しました。");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchQuestions(currentPage);
    }, [currentPage]);

    // ページ切り替え時の処理
    const handlePageChange = (page: number) => {
        setCurrentPage(page); // ページ状態を更新
    };

    // 問題を追加する関数
    const handleAddQuestion = async () => {
        setIsAdding(true)

        if (!text || !correctAnswer) {
            toast.error("問題文と正解を入力してください。");
            return;
        }

        const addQuestionPromise = fetch("/api/training/MakeQuestion/AddQuestion", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text, correctAnswer, email: admin.email }),
        });

        toast.promise(addQuestionPromise, {
            loading: "問題を追加中...",
            success: "問題が追加されました！",
            error: "問題の追加に失敗しました。",
        });

        try {
            await addQuestionPromise;
            setText("");
            setCorrectAnswer("");
            fetchQuestions(currentPage);
        } catch {
            // エラーはreact-hot-toastが処理するので、ここでは何もしません
        } finally {
            setIsUpdating(false);
        }
    };

    // 問題を更新する関数
    const handleUpdateQuestion = async (id: string) => {
        setIsUpdating(true);

        if (!newText || !newCorrectAnswer) {
            toast.error("問題文と正解を入力してください。");
            setIsUpdating(false);
            return;
        }

        const updateQuestionPromise = fetch("/api/training/MakeQuestion/UpdateQuestion", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id, text: newText, correctAnswer: newCorrectAnswer }),
        });

        toast.promise(updateQuestionPromise, {
            loading: "問題を更新中...",
            success: "問題が更新されました！",
            error: "問題の更新に失敗しました。",
        });

        try {
            await updateQuestionPromise;
            setEditingQuestionId(null);
            fetchQuestions(currentPage);
        } catch {
            // エラーはreact-hot-toastが処理するので、ここでは何もしません
        } finally {
            setIsUpdating(false);
        }
    };

    // 問題を削除する関数
    const handleDeleteQuestion = async (id: string) => {
        setIsDeleting(true);

        const deleteQuestionPromise = fetch("/api/training/MakeQuestion/DeleteQuestion", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id }),
        });

        toast.promise(deleteQuestionPromise, {
            loading: "問題を削除中...",
            success: "問題が削除されました！",
            error: "問題の削除に失敗しました。",
        });

        try {
            await deleteQuestionPromise;
            fetchQuestions(currentPage);
        } catch {
            // エラーはreact-hot-toastが処理するので、ここでは何もしません
        } finally {
            setIsDeleting(false);
        }
    };

    const handleUpdateClick = (question: Question) => {
        setEditingQuestionId(question.id);
        setNewText(question.text);
        setNewCorrectAnswer(question.correctAnswer);
    };

    return (
        <div className="bg-blue-100 min-h-screen flex flex-col">
            <AdminNavigationbar />
            <div className="flex flex-wrap gap-6 justify-center items-start mt-10 mx-auto max-w-7xl">
                {/* 問題リスト表示 */}
                <Card className="shadow-md p-6 flex-1 min-w-[850px]">
                    <CardHeader>
                        <h1 className="text-2xl font-bold text-gray-800">問題リスト</h1>
                    </CardHeader>
                    <Divider />
                    <CardBody>
                        {isLoading ? (
                            <div className="flex justify-center items-center h-64">
                                <Spinner label="問題情報を取得中..." color="success" />
                            </div>
                        ) : (
                            <>
                                <Table aria-label="問題リスト" shadow="none">
                                    <TableHeader>
                                        <TableColumn>問題文</TableColumn>
                                        <TableColumn>正解</TableColumn>
                                        <TableColumn>作成者</TableColumn>
                                        <TableColumn>作成日時</TableColumn>
                                        <TableColumn>操作</TableColumn>
                                    </TableHeader>
                                    <TableBody>
                                        {questions.map((item) => (
                                            <TableRow key={item.id}>
                                                <TableCell>
                                                    {editingQuestionId === item.id ? (
                                                        <Input value={newText} onChange={(e) => setNewText(e.target.value)} />
                                                    ) : (
                                                        item.text
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    {editingQuestionId === item.id ? (
                                                        <Input value={newCorrectAnswer} onChange={(e) => setNewCorrectAnswer(e.target.value)} />
                                                    ) : (
                                                        item.correctAnswer
                                                    )}
                                                </TableCell>
                                                <TableCell>{item.adminName}</TableCell>
                                                <TableCell>{new Date(item.createdAt).toLocaleString()}</TableCell>
                                                <TableCell className="flex">
                                                    {editingQuestionId === item.id ? (
                                                        <Button size="sm" color="success" isDisabled={isUpdating} onClick={() => handleUpdateQuestion(item.id)}>
                                                            {isUpdating ? "更新中..." : "保存"}
                                                        </Button>
                                                    ) : (
                                                        <Button size="sm" color="secondary" onClick={() => handleUpdateClick(item)}>
                                                            更新
                                                        </Button>
                                                    )}
                                                    <Button size="sm" color="danger" className="ml-2" isDisabled={isDeleting} onClick={() => handleDeleteQuestion(item.id)}>
                                                        {isDeleting ? "削除中..." : "削除"}
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                                {/* ページネーション */}
                                <div className="flex justify-center mt-6">
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

                {/* 問題追加フォーム */}
                <Card className="shadow-md p-6 flex-1 min-w-[400px]">
                    <CardHeader>
                        <h1 className="text-2xl font-bold text-gray-800">問題を追加</h1>
                    </CardHeader>
                    <Divider />
                    <CardBody className="flex flex-col gap-4">
                        <Input
                            label="問題文"
                            placeholder="問題文を入力してください"
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                        />
                        <Input
                            label="正解"
                            placeholder="正解を入力してください"
                            value={correctAnswer}
                            onChange={(e) => setCorrectAnswer(e.target.value)}
                        />
                        <Button color="primary" isDisabled={isAdding} onClick={handleAddQuestion}>
                            {isAdding ? "追加中..." : "問題を追加"}
                        </Button>
                    </CardBody>
                </Card>
            </div>
        </div>
    );
};

export default ManageQuestionsPage;
