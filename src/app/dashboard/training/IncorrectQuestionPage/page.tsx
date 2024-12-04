/* 間違えた問題を出題するページ */

'use client';

import { useState, useEffect } from "react";
import { Button, Input, Spinner, Card, CardHeader, CardBody, CardFooter, Divider } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { speak } from "@/lib/WebSpeechApi";
import { TrainingPageNavbar } from "@/app/components/Navbar/TrainingPageNavbar";
import { StudentUseAuth } from "@/hooks/useAuth/StudentUseAuth";

interface Question {
    id: number;
    text: string;
    correctAnswer: string;
    isAnswered: boolean;
    isCorrect: boolean | null;
}

const SolveIncorrectQuestionPage = () => {
    const [questions, setQuestions] = useState<Question[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [userAnswer, setUserAnswer] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showNextButton, setShowNextButton] = useState(false);
    const [feedback, setFeedback] = useState<{ message: string; color: string } | null>(null);
    const [isAllQuestionsCompleted, setIsAllQuestionsCompleted] = useState(false);
    const router = useRouter();
    const loginUser = StudentUseAuth();

    const fetchQuestions = async () => {
        try {
            setIsLoading(true);
            const res = await fetch("/api/training/GetQuestion/getIncorrect", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ studentId: loginUser.studentId }),
            });

            if (!res.ok) throw new Error("問題の取得に失敗しました");
            const data = await res.json();
            setQuestions(data.questions as Question[]);
        } catch (error) {
            toast.error((error as Error).message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (loginUser.studentId) fetchQuestions();
    }, [loginUser.studentId]);

    const handleSubmit = async () => {
        try {
            setIsSubmitting(true);
            const question = questions[currentQuestionIndex];

            const res = await fetch("/api/training/SendQuestion/sendIncorrect", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    questionId: question.id,
                    studentId: loginUser.studentId,
                    userAnswer: userAnswer,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                toast.error(data.error);
                return;
            }

            if (data.flag) {
                setFeedback({ message: "正解です！", color: "text-green-500" });
            } else {
                setFeedback({
                    message: `不正解です。 正しい答え: ${data.correctAnswer}`,
                    color: "text-red-500",
                });
            }

            speak(data.correctAnswer);

            setShowNextButton(true);

            if (currentQuestionIndex + 1 >= questions.length) {
                setIsAllQuestionsCompleted(true);
            }
        } catch {
            toast.error("回答の送信に失敗しました");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleNextQuestion = () => {
        setShowNextButton(false);
        setFeedback(null);
        setUserAnswer("");

        if (currentQuestionIndex + 1 < questions.length) {
            setCurrentQuestionIndex((prev) => prev + 1);
        }
    };

    const handleBack = () => {
        router.push("/dashboard/training");
    };

    if (isLoading) {
        return (
            <div className="bg-blue-100 min-h-screen flex flex-col">
                <TrainingPageNavbar />
                <div className="flex justify-center items-center my-auto">
                    <Spinner color="success" size="lg" label="問題を読み込んでいます..." className="text-blue-500" />
                </div>
            </div>
        );
    }

    if (questions.length === 0) {
        return (
            <div className="bg-blue-100 min-h-screen flex flex-col">
                <TrainingPageNavbar />
                <div className="flex justify-center items-center my-auto">
                    <p className="text-center text-gray-600">間違えた問題がありません。</p>
                </div>
            </div>
        );
    }

    const currentQuestion = questions[currentQuestionIndex];

    return (
        <div className="bg-blue-100 min-h-screen flex flex-col">
            <TrainingPageNavbar />
            <div className="flex flex-col items-center justify-center p-6">
                <Card className="shadow-md p-6 max-w-xl w-full">
                    <CardHeader>
                        <h1 className="text-2xl font-bold text-gray-800">復習問題に挑戦！</h1>
                    </CardHeader>
                    <Divider />
                    <CardBody className="mt-3">
                        <p className="text-lg text-gray-700 mb-6">{currentQuestion.text}</p>
                        <Input
                            type="text"
                            isClearable
                            variant="faded"
                            value={userAnswer}
                            color="success"
                            onChange={(e) => setUserAnswer(e.target.value)}
                            className="w-full p-3 text-gray-700 mb-5"
                            placeholder="答えを入力してください"
                            disabled={showNextButton || isAllQuestionsCompleted} 
                        />
                        {feedback && (
                            <p className={`mt-3 ${feedback.color}`}>{feedback.message}</p>
                        )}
                        {isAllQuestionsCompleted && (
                            <>
                                <p className="text-green-600 font-medium mt-4">
                                    全ての問題を解き終わりました！
                                </p>
                                <p className="text-gray-700 font-light">
                                    ※ 間違えた問題がある場合、復習ページから問題を解き直してください。
                                </p>
                            </>
                        )}
                    </CardBody>
                    <Divider />
                    <CardFooter>
                        {isAllQuestionsCompleted ? (
                            <Button
                                onClick={handleBack}
                                className="w-full py-3 rounded-lg font-semibold text-white text-lg transition bg-gray-500 hover:bg-gray-600"
                            >
                                戻る
                            </Button>
                        ) : showNextButton ? (
                            <Button
                                onClick={handleNextQuestion}
                                className="w-full py-3 rounded-lg font-semibold text-white text-lg transition bg-green-500 hover:bg-green-600"
                            >
                                次の問題へ
                            </Button>
                        ) : (
                            <Button
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                                className={`w-full py-3 rounded-lg font-semibold text-white text-lg transition ${
                                    isSubmitting ? "bg-blue-300" : "bg-blue-500 hover:bg-blue-600"
                                }`}
                            >
                                {isSubmitting ? "採点中..." : "採点"}
                            </Button>
                        )}
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
};

export default SolveIncorrectQuestionPage;