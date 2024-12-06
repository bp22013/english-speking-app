/* 一般の問題出題ページ */

'use client';

import { useState, useEffect } from "react";
import { Button, Input, Spinner, Card, CardHeader, CardBody, CardFooter, Divider, Slider, Tooltip } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { speak } from "@/lib/WebSpeechApi";
import { TrainingPageNavbar } from "@/app/components/Navbar/TrainingPageNavbar";
import { StudentUseAuth } from "@/hooks/useAuth/StudentUseAuth";

interface Question {
    id: number;
    text: string;
    correctAnswer: string;
}

const SolveQuestionPage = () => {
    const [questions, setQuestions] = useState<Question[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [correctAnswer, setCorrectAnswer] = useState("");
    const [userAnswer, setUserAnswer] = useState("");
    const [SpeedValue, SetspeedValue] = useState(1.0);
    const [InputSpeedValue, InputSetSpeedValue] = useState("1.0");
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showNextButton, setShowNextButton] = useState(false);
    const [feedback, setFeedback] = useState<{ message: string; color: string } | null>(null);
    const [isAllQuestionsCompleted, setIsAllQuestionsCompleted] = useState(false); // 全問題解き終わりのフラグ
    const router = useRouter();
    const loginUser = StudentUseAuth();

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                setIsLoading(true);
                const res = await fetch("/api/training/GetQuestion/getAssigned", {
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

        if (loginUser.studentId) fetchQuestions();
    }, [loginUser.studentId]);

    const handleSubmit = async () => {
        try {
            setIsSubmitting(true);
            const question = questions[currentQuestionIndex];

            const res = await fetch("/api/training/SendQuestion/sendAssigned", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    questionId: question.id,
                    studentId: loginUser.studentId,
                    submittedAnswer: userAnswer,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                toast.error(data.error);
                return;
            }

            // 判定結果に応じたフィードバックを設定
            if (data.flag) {
                setFeedback({ message: "正解です！", color: "text-green-500" });
            } else {
                setFeedback({
                    message: `不正解です。 正しい答え: ${data.correctAnswer}`,
                    color: "text-red-500",
                });
            }

            setCorrectAnswer(data.correctAnswer);
            speak(data.correctAnswer, 1.0);

            setShowNextButton(true); // 採点後に次の問題ボタンを表示

            if (currentQuestionIndex + 1 >= questions.length) {
                setIsAllQuestionsCompleted(true); // 全問題解き終わりを設定
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
        SetspeedValue(1.0);
        InputSetSpeedValue("1.0");

        if (currentQuestionIndex + 1 < questions.length) {
            setCurrentQuestionIndex((prev) => prev + 1);
        }
    };

    const handleBack = () => {
        router.push("/dashboard/training");
    };

    const handlePlayAgain = () => {
        speak(correctAnswer, SpeedValue);
    };

    const handleChange = (value: number | number[]) => {
        if (Array.isArray(value)) {
            return;
        }

        SetspeedValue(value);
        InputSetSpeedValue(value.toString());
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
                        <h1 className="text-2xl font-bold text-gray-800">日本語を英単語に訳してみよう！</h1>
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
                            placeholder="スペルを入力してください"
                            disabled={showNextButton || isAllQuestionsCompleted} // 次の問題ボタンが表示中は入力を無効化
                        />
                        {feedback && (
                            <p className={`mt-3 ${feedback.color}`}>{feedback.message}</p>
                        )}
                        {isAllQuestionsCompleted && (
                            <>
                                <p className="text-green-600 font-medium mt-4">
                                    全ての問題が解き終わりました！
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
                                color="primary"
                                className="w-full py-3 font-semibold text-white text-lg transition hover:bg-blue-400"
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
                {showNextButton && (
                    <Card className="shadow-md p-6 max-w-xl w-full mt-3 ">
                        <CardBody>
                            <Button color="secondary" onClick={handlePlayAgain}>
                                もう一度再生
                            </Button>
                            <Divider/>
                            <Slider
                                label="再生速度"
                                step={0.1}
                                minValue={0.5}
                                maxValue={1.5}
                                marks={[
                                    {
                                        value: 0.5,
                                        label: "遅"
                                    },
                                    {
                                        value: 1.0,
                                        label: "普"
                                    },
                                    {
                                        value: 1.5,
                                        label: "速"
                                    },
                                ]}
                                renderValue={({ ...props }) => (
                                    <output {...props}>
                                        <Tooltip
                                            className="text-tiny text-default-500 rounded-md"
                                            content="Press Enter to confirm"
                                            placement="left"
                                        >
                                            <input
                                            className="px-1 py-0.5 w-12 text-right text-small text-default-700 font-medium bg-default-100 outline-none transition-colors rounded-small border-medium border-transparent hover:border-primary focus:border-primary"
                                            type="text"
                                            aria-label="Speed value"
                                            value={InputSpeedValue}
                                            onChange={(e) => {
                                                const v = e.target.value;

                                                InputSetSpeedValue(v);
                                            }}
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter" && !isNaN(Number(InputSpeedValue))) {
                                                    SetspeedValue(Number(InputSpeedValue));
                                                }
                                            }}
                                            />
                                        </Tooltip>
                                    </output>
                                )}
                                value={SpeedValue}
                                onChange={handleChange}
                            >
                            </Slider>
                        </CardBody>
                    </Card>
                )}
            </div>
        </div>
    );
};

export default SolveQuestionPage;
