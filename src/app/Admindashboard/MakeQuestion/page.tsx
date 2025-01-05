/* 問題を作成するページ */

'use client';

import React, { useEffect, useState } from "react";
import { Table, Button, Input, Card, CardHeader, CardBody, Divider, 
         TableHeader, TableColumn, TableBody, TableRow, TableCell, Spinner, Pagination, 
         Select,
         SelectItem} from "@nextui-org/react";
import toast from "react-hot-toast";
import { AdminNavigationbar } from "@/app/components/Navbar/AdminNavbar";
import { AdminUseAuth } from "@/hooks/useAuth/AdminUseAuth";
import { PiMagnifyingGlassDuotone } from "react-icons/pi";

interface Question {
    id: string;
    text: string;
    correctAnswer: string;
    level: number;
    createdAt: string;
    adminName: string;
}

const ManageQuestionsPage = () => {
    const [questions, setQuestions] = useState<Question[]>([]);
    const [allQuestions, setAllQuestions] = useState<Question[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [isAdding, setIsAdding] = useState<boolean>(false);
    const [isDeleting, setIsDeleting] = useState<boolean>(false);
    const [isUpdating, setIsUpdating] = useState<boolean>(false);
    const [text, setText] = useState("");
    const [correctAnswer, setCorrectAnswer] = useState("");
    const [level, setLevel] = useState<number | null>(null);
    const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null);
    const [newText, setNewText] = useState<string>("");
    const [newCorrectAnswer, setNewCorrectAnswer] = useState<string>("");
    const [newLevel, setNewLevel] = useState<number | null>(null);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [sortOption, setSortOption] = useState<string>("createdAt-desc");
    const admin = AdminUseAuth();
    const itemsPerPage = 10;

    //問題を取得する関数
    const fetchQuestions = async () => {
        setIsLoading(true);
        try {
            const res = await fetch("/api/training/MakeQuestion/GetQuestion", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ page: currentPage, limit: itemsPerPage, searchQuery, sortOption }),
            });
    
            const data = await res.json();
    
            if (res.ok) {
                setQuestions(data.questions);
                setAllQuestions(data.allQuestions);
                console.log("問題リストを取得しました！");
            } else {
                console.error(data.error || "データの取得に失敗しました。");
            }
        } catch {
            console.error("問題リストの取得に失敗しました。");
        } finally {
            setIsLoading(false);
        }
    };

    // 検索ボックスの変更処理
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };

    // 並び替えオプション変更時の処理
    const handleSortChange = (value: string) => {
        setSortOption(value);
    };

    // ページ切り替え時の処理
    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    // 問題を追加する関数
    const handleAddQuestion = async () => {
        setIsAdding(true);
        if (!text || !correctAnswer || level === null) {
            toast.error("問題文、正解、レベルを入力してください。");
            return;
        }

        toast.promise(
            new Promise(async (resolve, reject) => {
                try {
                    const res = await fetch("/api/training/MakeQuestion/AddQuestion", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ text, correctAnswer, level, email: admin.email }),
                    });
        
                    const data = await res.json();
        
                    if (res.ok) {
                        fetchQuestions();
                        resolve("問題が追加されました！");
                    } else {
                        reject(data.error || "問題の追加に失敗しました。");
                    }
                } catch {
                    reject("サーバーエラーが発生しました。");
                } finally {
                    setIsAdding(false);
                }
            }),
            {
                loading: "問題を追加中...",
                success: "問題が追加されました！",
                error: (message) => message, // サーバーから返されるエラーメッセージを表示
            }
        );
    };

    // 問題を更新する関数
    const handleUpdateQuestion = async (id: string) => {

        setIsUpdating(true);

        if (!newText || !newCorrectAnswer || newLevel === null) {
            toast.error("問題文、正解、レベルを入力してください。");
            return;
        }

        toast.promise(
            new Promise(async (resolve, reject) => {
                try {
                    const res = await fetch("/api/training/MakeQuestion/UpdateQuestion", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ id, text: newText, correctAnswer: newCorrectAnswer, level: newLevel }),
                    });

                    const data = await res.json();

                    if (res.ok) {
                        setEditingQuestionId(null);
                        fetchQuestions();
                        resolve("問題が更新されました！");
                    } else {
                        reject(data.error || "問題の更新に失敗しました。");
                    }
                } catch {
                    reject("問題の更新に失敗しました。");
                } finally {
                    setIsUpdating(false);
                }
            }),
            {
                loading: "問題を更新中...",
                success: "問題が更新されました！",
                error: (message) => message,
            }
        );
    };

    // 問題を削除する関数
    const handleDeleteQuestion = async (id: string) => {
        setIsDeleting(true);

        toast.promise(
            new Promise(async (resolve, reject) => {
                try {
                    const res = await fetch("/api/training/MakeQuestion/DeleteQuestion", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ id }),
                    });

                    const data = await res.json();

                    if (res.ok) {
                        fetchQuestions();
                        resolve("問題が削除されました！");
                    } else {
                        reject(data.error || "問題の削除に失敗しました。");
                    }
                } catch {
                    reject("問題の削除に失敗しました。");
                } finally {
                    setIsDeleting(false);
                }
            }),
            {
                loading: "問題を削除中...",
                success: "問題が削除されました！",
                error: (message) => message,
            }
        );
    };

    useEffect(() => {
        fetchQuestions();
    }, [currentPage, searchQuery, sortOption]);

    const handleUpdateClick = (question: Question) => {
        setEditingQuestionId(question.id);
        setNewText(question.text);
        setNewCorrectAnswer(question.correctAnswer);
        setNewLevel(question.level);
    };

    const handleCancelEdit = () => {
        setEditingQuestionId(null);
        setNewText("");
        setNewCorrectAnswer("");
        setNewLevel(null);
    };

    const selectProps = [
        { key: "createdAt-desc", label: "作成日: 新しい順" },
        { key: "createdAt-asc", label: "作成日: 古い順" },
        { key: "text-asc", label: "問題文: 昇順" },
        { key: "text-desc", label: "問題文: 降順" },
        { key: "level-asc", label: "レベル: 昇順" },
        { key: "level-desc", label: "レベル: 降順" },
    ];

    const levelProps = Array.from({ length: 10 }, (_, i) => ({
        key: `${i + 1}`,
        label: `${i + 1}`,
    }));

    return (
        <div className="bg-blue-100 min-h-screen flex flex-col">
            <AdminNavigationbar />
            <div className="flex flex-wrap gap-6 justify-center items-start mt-10 mx-auto max-w-7xl">
                <Card className="shadow-md p-6 flex-1 min-w-[850px]">
                    <CardHeader className="flex justify-between items-center">
                        <h1 className="text-2xl font-bold text-gray-800">問題リスト</h1>
                        <div className="flex items-center gap-4">
                            <Input
                                placeholder="検索"
                                value={searchQuery}
                                startContent={<PiMagnifyingGlassDuotone />}
                                onChange={handleSearchChange}
                                color="primary"
                            />
                            <Select
                                value={sortOption}
                                placeholder="並び替え"
                                size="md"
                                onChange={(e) => handleSortChange(e.target.value)}
                                className="max-w-xs"
                            >
                                {selectProps.map((sort) => (
                                    <SelectItem key={sort.key}>{sort.label}</SelectItem>
                                ))}
                            </Select>
                        </div>
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
                                        <TableColumn>レベル</TableColumn>
                                        <TableColumn>作成者</TableColumn>
                                        <TableColumn>作成日時</TableColumn>
                                        <TableColumn>操作</TableColumn>
                                    </TableHeader>
                                    <TableBody emptyContent="問題がありません">
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
                                            <TableCell>
                                                {editingQuestionId === item.id ? (
                                                    <Input
                                                        value={newLevel !== null ? newLevel.toString() : ""}
                                                        onChange={(e) => setNewLevel(e.target.value ? parseInt(e.target.value, 10) : null)}
                                                    />
                                                ) : (
                                                    item.level
                                                )}
                                            </TableCell>
                                            <TableCell>{item.adminName}</TableCell>
                                            <TableCell>{new Date(item.createdAt).toLocaleString()}</TableCell>
                                            <TableCell>
                                                {editingQuestionId === item.id ? (
                                                    <div className="flex gap-2">
                                                        <Button size="sm" color="success" isDisabled={isUpdating} onClick={() => handleUpdateQuestion(item.id)}>
                                                            {isUpdating ? "更新中..." : "保存"}
                                                        </Button>
                                                        <Button size="sm" color="primary" variant="flat" isDisabled={isUpdating} onClick={handleCancelEdit}>
                                                            キャンセル
                                                        </Button>
                                                    </div>
                                                ) : (
                                                    <div className="flex gap-2">
                                                        <Button size="sm" className="bg-[#ba55d3] text-white" onClick={() => handleUpdateClick(item)}>
                                                            更新
                                                        </Button>
                                                        <Button size="sm" color="danger" isDisabled={isDeleting} onClick={() => handleDeleteQuestion(item.id)}>
                                                            {isDeleting ? "削除中..." : "削除"}
                                                        </Button>
                                                    </div>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                                <div className="flex justify-center mt-6">
                                    <Pagination
                                        total={Math.ceil(allQuestions.length / itemsPerPage)}
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
                        <Select
                            value={level?.toString()}
                            onChange={(e) => setLevel(parseInt(e.target.value, 10))}
                            placeholder="レベルを選択"
                            size="md"
                            className="max-w-xs"
                        >
                            {levelProps.map((item) => (
                                <SelectItem key={item.key}>{item.label}</SelectItem>
                            ))}
                        </Select>
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
