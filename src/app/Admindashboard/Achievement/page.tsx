/* 生徒の成績確認ページ */

'use client';

import { NextPage } from 'next';
import { useState, useEffect } from 'react';
import { AdminNavigationbar } from '@/app/components/Navbar/AdminNavbar';
import { Card, CardBody, CardHeader, Divider, Select, SelectItem, Spinner, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from '@nextui-org/react';
import AssignedQuestionsStats from '@/app/components/graph/AchievementReferenceSheet';
import toast from 'react-hot-toast';

interface Student {
    id: string;
    name: string;
    studentId: string;
}

interface IncorrectAnswer {
    submittedAnswer: string;
    correctAnswer: string;
    level: number;
    questionText: string;
}

const AchievementPage: NextPage = () => {
    const [students, setStudents] = useState<Student[]>([]);
    const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
    const [incorrectAnswers, setIncorrectAnswers] = useState<IncorrectAnswer[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    // 生徒一覧を取得する関数
    const fetchStudents = async () => {
        setIsLoading(true);
        try {
            const res = await fetch("/api/auth/delete/getInformation/student", {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            });

            const data = await res.json();

            if (res.ok) {
                setStudents(data.students);
            } else {
                toast.error(data.error || "生徒情報の取得に失敗しました");
            }
        } catch {
            toast.error("生徒情報の取得に失敗しました");
        } finally {
            setIsLoading(false);
        }
    };

    // 生徒の間違えた問題の情報を取得する関数
    const fetchIncorrectQuestion = async (studentId: string) => {
        setIsLoading(true);
        try {
            const res = await fetch("/api/achievement/admin", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ studentId }),
            });

            const data = await res.json();

            if (res.ok) {
                setIncorrectAnswers(data.incorrectAnswers);
            } else {
                toast.error(data.error || "間違えた問題の情報の取得に失敗しました");
            }
        } catch {
            toast.error("間違えた問題の情報の取得に失敗しました");
        } finally {
            setIsLoading(false);
        }
    };

    // 初回レンダリング時に生徒一覧を取得
    useEffect(() => {
        fetchStudents();
    }, []);

    // 生徒選択時の処理
    const handleStudentSelect = (studentId: string) => {
        setSelectedStudentId(studentId);
        fetchIncorrectQuestion(studentId);
    };

    return (
        <div className="bg-blue-100 min-h-screen flex flex-col">
            <AdminNavigationbar />
            <div className="flex flex-wrap gap-6 justify-center items-start my-10 mx-auto max-w-7xl">
                <Card className="shadow-md p-6 flex-1 min-w-[900px]">
                    <CardHeader className="flex justify-between items-center text-3xl">
                        <h1>
                            <strong>生徒の成績</strong>
                        </h1>
                        <Select
                            value={selectedStudentId || ''}
                            placeholder="生徒を選択"
                            onChange={(e) => handleStudentSelect(e.target.value)}
                            className="max-w-xs"
                        >
                            {students.map((student) => (
                                <SelectItem key={student.studentId} value={student.studentId}>
                                    {student.name}
                                </SelectItem>
                            ))}
                        </Select>
                    </CardHeader>
                    <Divider className="my-2" />
                    <CardBody>
                        {isLoading ? (
                            <Spinner color="success" label="読み込み中..." />
                        ) : selectedStudentId ? (
                            <>
                                <AssignedQuestionsStats studentId={selectedStudentId} />
                                <Divider />
                                <h2 className="text-2xl mt-6 mb-4">
                                    <strong>間違えた問題一覧</strong>
                                </h2>
                                <Table aria-label="間違えた問題一覧" shadow="none">
                                    <TableHeader>
                                        <TableColumn>問題文</TableColumn>
                                        <TableColumn>あなたの回答</TableColumn>
                                        <TableColumn>正しい答え</TableColumn>
                                        <TableColumn>レベル</TableColumn>
                                    </TableHeader>
                                    <TableBody emptyContent="間違えた問題はありません。">
                                        {incorrectAnswers.length > 0 ? (
                                            incorrectAnswers.map((answer, index) => (
                                                <TableRow key={index}>
                                                    <TableCell>{answer.questionText}</TableCell>
                                                    <TableCell className="text-red-500">{answer.submittedAnswer}</TableCell>
                                                    <TableCell className="text-green-500">{answer.correctAnswer}</TableCell>
                                                    <TableCell>{answer.level}</TableCell>
                                                </TableRow>
                                            ))
                                        ) : (
                                            <></>
                                        )}
                                    </TableBody>
                                </Table>
                            </>
                        ) : (
                            <p>生徒を選択してください。</p>
                        )}
                    </CardBody>
                </Card>
            </div>
        </div>
    );
};

export default AchievementPage;
