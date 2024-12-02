/* 単語仕分けページ */

'use client';

import { NextPage } from "next";
import { useState, useEffect } from "react";
import { Input, Button, Spinner } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { TrainingPageNavbar } from "@/app/components/Navbar/TrainingPageNavbar";
import { PrevConfirmModal } from "@/app/components/Modal/PrevConfirmModal";
import { StudentUseAuth } from "@/hooks/useAuth/StudentUseAuth";
import { speak } from "@/lib/WebSpeechApi";
import toast from "react-hot-toast";

interface Question {
    id: number;
    text: string;
    correctAnswer: string;
}

const TrainingSortPage: NextPage = () => {
    const [questions, setQuestions] = useState<Question[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answeredQuestionIds, setAnsweredQuestionIds] = useState<number[]>([]); // 解答済み問題ID
    const [userAnswer, setUserAnswer] = useState("");
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false); // モーダル表示状態
    const [isQuestionsLoading, setIsQuestionsLoading] = useState(true); // 問題取得中状態
    const loginuser = StudentUseAuth();
    const router = useRouter();

    // 問題を取得
    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                setIsQuestionsLoading(true);
                const res = await fetch("/api/training/GetQuestion/sort", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        studentId: loginuser?.studentId, // ログインユーザーのIDを送信
                    }),
                });

                if (!res.ok) {
                    throw new Error("問題の取得に失敗しました");
                }

                const data = await res.json();
                setQuestions(data.questions || []);
            } catch (error) {
                toast.error((error as Error).message || "問題の取得中にエラーが発生しました");
            } finally {
                setIsQuestionsLoading(false);
            }
        };

        if (loginuser?.studentId) {
            fetchQuestions();
        }
    }, [loginuser?.studentId]);

    // ページ離脱を検知するイベントリスナーを追加
    useEffect(() => {
        history.pushState(null, "", null);
        const handleBeforeUnload = (event: BeforeUnloadEvent) => {
            event.preventDefault();
            handleModalOpen();
            return;
        };

        const handlePopState = () => {
            handleModalOpen();
            history.pushState(null, "", null);
            return;
        };

        window.addEventListener("beforeunload", handleBeforeUnload);
        window.addEventListener("popstate", handlePopState);

        return () => {
            // クリーンアップ
            window.removeEventListener("beforeunload", handleBeforeUnload);
            window.removeEventListener("popstate", handlePopState);
        };
    }, []);

    // 現在の問題を取得
    const currentQuestion = questions[currentQuestionIndex];

    // 回答を送信して採点
    const submitAnswer = async () => {
        if (!currentQuestion) return;

        setLoading(true);
        try {
            const res = await fetch("/api/training/SendQuestion/sort", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    questionId: currentQuestion.id,
                    submittedAnswer: userAnswer,
                    studentId: loginuser?.studentId,
                }),
            });

            const data = await res.json();

            if (res.ok) {
                setIsCorrect(data.isCorrect);
                if (data.isCorrect) {
                    toast.success(data.message); // 正解の場合
                } else {
                    toast.error(data.message); // 不正解の場合
                }

                // 音声で単語を発音
                speak(currentQuestion.correctAnswer);

                // 解答済み問題IDを更新
                setAnsweredQuestionIds((prev) => [...prev, currentQuestion.id]);
            } else {
                toast.error(data.error || "採点処理中にエラーが発生しました");
            }
        } catch {
            toast.error("採点処理中にエラーが発生しました");
        } finally {
            setLoading(false);
        }
    };

    // 次の問題へ進む
    const nextQuestion = () => {
        setIsCorrect(null);
        setUserAnswer("");
        setCurrentQuestionIndex((prev) => prev + 1);
    };

    // トレーニングページに戻る
    const goBackToTrainingPage = () => {
        router.push("/dashboard/training");
    };

    // モーダルの開閉制御
    const handleModalOpen = () => setShowModal(true);
    const handleModalClose = () => setShowModal(false);

    // 表示内容を切り替え
    if (isQuestionsLoading) {
        return (
            <div className="bg-blue-100 min-h-screen flex items-center justify-center">
                <div className="text-center flex">
                    <Spinner label="Loading..." color="success" size="lg" />
                </div>
            </div>
        );
    }

    if (currentQuestionIndex >= questions.length) {
        return (
            <div className="bg-blue-100 min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <p className="text-xl font-bold mb-4">トレーニングが終了しました！</p>
                    <Button
                        className="px-6 py-2 text-white bg-blue-500 hover:bg-blue-600 rounded"
                        onClick={goBackToTrainingPage}
                    >
                        戻る
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="bg-blue-100 min-h-screen">
                <TrainingPageNavbar answeredQuestionIds={answeredQuestionIds} />
                <div className="container mx-auto px-4 py-8">
                    <h1 className="text-2xl font-bold mb-6">単語仕分けトレーニング</h1>
                    <div className="bg-white shadow-md p-4 rounded">
                        <p className="text-lg font-medium mb-2">{currentQuestion.text}</p>
                        <Input
                            type="text"
                            className="w-full border border-gray-300 rounded px-3 py-2"
                            value={userAnswer}
                            onChange={(e) => setUserAnswer(e.target.value)}
                        />
                    </div>
                    {isCorrect !== null && (
                        <div className="mt-4">
                            <p className={`text-lg font-bold ${isCorrect ? "text-green-500" : "text-red-500"}`}>
                                {isCorrect ? "正解！" : `不正解。正解は: ${currentQuestion.correctAnswer}`}
                            </p>
                        </div>
                    )}
                    <div className="mt-6 flex space-x-4">
                        {isCorrect === null && (
                            <Button
                                className={`px-6 py-2 text-white rounded ${
                                    loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
                                }`}
                                disabled={loading}
                                onClick={submitAnswer}
                            >
                                {loading ? "採点中..." : "採点"}
                            </Button>
                        )}
                        {isCorrect !== null && (
                            <Button
                                className="px-6 py-2 text-white bg-green-500 hover:bg-green-600 rounded"
                                onClick={nextQuestion}
                            >
                                次の問題へ
                            </Button>
                        )}
                    </div>
                </div>
                <PrevConfirmModal
                    showFlag={showModal}
                    ChangeFlag={handleModalClose}
                    answeredQuestionIds={answeredQuestionIds}
                />
            </div>
        </>
    );
};

export default TrainingSortPage;
