/* 単語仕分けページ */

'use client';

import { NextPage } from "next";
import { useState, useEffect } from "react";
import { Input, Button } from "@nextui-org/react";
import { TrainingPageNavbar } from "@/app/components/Navbar/TrainingPageNavbar";
import { StudentUseAuth } from "@/hooks/useAuth/StudentUseAuth";
import toast from "react-hot-toast";

interface Question {
  id: number;
  text: string;
}

const TrainingSortPage: NextPage = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [loading, setLoading] = useState(false);
  const loginuser = StudentUseAuth();

  // 問題を取得する
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await fetch("/api/training/GetQuestion/sort");
        const data = await res.json();
        setQuestions(data.questions);
      } catch (error) {
        toast.error("問題の取得中にエラーが発生しました:", error);
      }
    };

    fetchQuestions();
  }, []);

  // 回答の入力を処理
  const handleAnswerChange = (questionId: number, answer: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  // 回答を送信
  const submitAnswers = async () => {
    setLoading(true);

    try {
      const res = await fetch("/api/training/SendQuestion/sort", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ answers, studentId: loginuser.studentId }),
      });

      if (res.ok) {
        toast.success("回答を送信しました！");
        setAnswers({});
      } else {
        toast.error("回答の送信に失敗しました");
      }
    } catch {
      toast.error("回答の送信中にエラーが発生しました");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="bg-blue-100 min-h-screen">
        <TrainingPageNavbar />
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold mb-6">単語仕分けトレーニング</h1>
          <div className="space-y-4">
            {questions.map((question) => (
              <div key={question.id} className="bg-white shadow-md p-4 rounded">
                <p className="text-lg font-medium mb-2">{question.text}</p>
                <Input
                  type="text"
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  value={answers[question.id] || ""}
                  onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                />
              </div>
            ))}
          </div>
          <Button
            className={`mt-6 px-6 py-2 text-white rounded ${
              loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
            }`}
            disabled={loading}
            onClick={submitAnswers}
          >
            {loading ? "送信中..." : "送信"}
          </Button>
        </div>
      </div>
    </>
  );
};

export default TrainingSortPage;
