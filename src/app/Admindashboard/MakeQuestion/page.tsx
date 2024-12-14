/* 問題を作成するページ */

'use client';

import React, { useState } from "react";
import { Table, Button, Input, Card, CardHeader, CardBody, Divider, 
         TableHeader, TableColumn, TableBody, TableRow, TableCell, Spinner } from "@nextui-org/react";
import toast from "react-hot-toast";
import { AdminNavigationbar } from "@/app/components/Navbar/AdminNavbar";
import { AdminUseAuth } from "@/hooks/useAuth/AdminUseAuth";
import { useInfiniteScroll } from "@nextui-org/use-infinite-scroll";
import { useAsyncList } from "@react-stately/data";

interface Question {
    id: string;
    text: string;
    correctAnswer: string;
    createdAt: string;
    adminName: string;
}

const ManageQuestionsPage = () => {
    const [hasMore, setHasMore] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [text, setText] = useState("");
    const [correctAnswer, setCorrectAnswer] = useState("");
    const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null);
    const [newText, setNewText] = useState<string>("");
    const [newCorrectAnswer, setNewCorrectAnswer] = useState<string>("");
    const admin = AdminUseAuth();

    const list = useAsyncList<Question>({
        async load({ signal, cursor }) {
            setIsLoading(true);
            try {
                const res = await fetch(cursor || "/api/training/MakeQuestion/GetQuestion", { signal });
                const json = await res.json();

                if (!res.ok) throw new Error(json.error || "データの取得に失敗しました");

                setHasMore(json.hasMore);
                return {
                    items: json.questions as Question[],
                    cursor: json.hasMore ? `/api/training/MakeQuestion/GetQuestion?page=${json.nextPage}` : undefined,
                };
            } catch {
                toast.error("エラーが発生しました。");
                return {
                    items: [] as Question[],
                    cursor: undefined,
                };
            } finally {
                setIsLoading(false);
            }
        },
    });

    const [loaderRef, scrollerRef] = useInfiniteScroll({
        hasMore,
        onLoadMore: list.loadMore,
    });

    const handleAddQuestion = async () => {
        if (!text || !correctAnswer) {
            toast.error("問題文と正解を入力してください。");
            return;
        }

        setIsSubmitting(true);
        try {
            const res = await fetch("/api/training/MakeQuestion/AddQuestion", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text, correctAnswer, email: admin.email }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "問題の作成に失敗しました");

            toast.success("問題が追加されました");
            setText("");
            setCorrectAnswer("");
            await list.reload();
        } catch {
            toast.error("エラーが発生しました。");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleUpdateQuestion = async (id: string) => {
        if (!newText || !newCorrectAnswer) {
            toast.error("問題文と正解を入力してください。");
            return;
        }

        setIsSubmitting(true);
        try {
            const res = await fetch('/api/training/MakeQuestion/UpdateQuestion', {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id, text: newText, correctAnswer: newCorrectAnswer }),
            });

            const data = await res.json();
            if (!res.ok) {
                toast.error(data.error);
                return;
            }
            
            toast.success("問題が更新されました");
            setEditingQuestionId(null);
            await list.reload();
        } catch (error) {
            toast.error("エラーが発生しました。" + error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteQuestion = async (id: string) => {
        setIsSubmitting(true);
        try {
            const res = await fetch('/api/training/MakeQuestion/DeleteQuestion', {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id }),
            });

            const data = await res.json();
            if (!res.ok) {
                toast.error(data.error);
                return;
            }
            
            toast.success("問題が削除されました");
            setEditingQuestionId(null);
            await list.reload();
        } catch (error) {
            toast.error("エラーが発生しました。" + error);
        } finally {
            setIsSubmitting(false);
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
                            <Table
                                isHeaderSticky
                                aria-label="問題リスト"
                                baseRef={scrollerRef}
                                bottomContent={
                                    hasMore ? (
                                        <div className="flex w-full justify-center">
                                            <Spinner ref={loaderRef} color="primary" />
                                        </div>
                                    ) : null
                                }
                                classNames={{
                                    base: "max-h-[520px] overflow-scroll",
                                    table: "min-h-[400px]",
                                }}
                            >
                                <TableHeader>
                                    <TableColumn>問題文</TableColumn>
                                    <TableColumn>正解</TableColumn>
                                    <TableColumn>作成者</TableColumn>
                                    <TableColumn>作成日時</TableColumn>
                                    <TableColumn>操作</TableColumn>
                                </TableHeader>
                                <TableBody
                                    items={list.items}
                                    loadingContent={<Spinner color="success" />}
                                >
                                    {(item: Question) => (
                                        <TableRow key={item.id}>
                                            <TableCell>
                                                {editingQuestionId === item.id ? (
                                                    <Input
                                                        value={newText}
                                                        onChange={(e) => setNewText(e.target.value)}
                                                    />
                                                ) : (
                                                    item.text
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                {editingQuestionId === item.id ? (
                                                    <Input
                                                        value={newCorrectAnswer}
                                                        onChange={(e) => setNewCorrectAnswer(e.target.value)}
                                                    />
                                                ) : (
                                                    item.correctAnswer
                                                )}
                                            </TableCell>
                                            <TableCell>{item.adminName}</TableCell>
                                            <TableCell>{new Date(item.createdAt).toLocaleString()}</TableCell>
                                            <TableCell>
                                                <div className="flex gap-2">
                                                    {editingQuestionId === item.id ? (
                                                        <Button
                                                            size="sm"
                                                            color="success"
                                                            onClick={() => handleUpdateQuestion(item.id)}
                                                        >
                                                            保存
                                                        </Button>
                                                    ) : (
                                                        <Button
                                                            size="sm"
                                                            color="secondary"
                                                            onClick={() => handleUpdateClick(item)}
                                                        >
                                                            更新
                                                        </Button>
                                                    )}
                                                    <Button
                                                        size="sm"
                                                        color="danger"
                                                        onClick={() => handleDeleteQuestion(item.id)}
                                                    >
                                                        削除
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        )}
                    </CardBody>
                </Card>

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
                        <Button
                            color="primary"
                            onClick={handleAddQuestion}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "追加中..." : "問題を追加"}
                        </Button>
                    </CardBody>
                </Card>
            </div>
        </div>
    );
};

export default ManageQuestionsPage;
