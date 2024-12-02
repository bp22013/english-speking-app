/* ドリルページの問題を取得するAPI */

'use server';

import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: Request) {
    try {
        // クライアントから生徒IDを取得
        const { studentId } = await request.json();

        if (!studentId) {
            return NextResponse.json({ message: "生徒IDが提供されていません" }, { status: 400 });
        }

        // studentId に基づいて学生のデータを取得
        const student = await prisma.student.findUnique({
            where: { studentId },
            select: { id: true },
        });

        if (!student) {
            return NextResponse.json(
                { message: "該当する学生が見つかりません" },
                { status: 404 }
            );
        }

        // 学生IDを取得
        const currentUserId = student.id;

        // 指定された生徒が不正解の問題IDを取得
        const incorrectAnswers = await prisma.answer.findMany({
            where: {
                studentId: currentUserId, // 特定の生徒IDの回答履歴
                isCorrect: false,    // 不正解のみ
            },
            select: {
                questionId: true,
            },
        });

        // 不正解の問題IDを配列に変換
        const incorrectQuestionIds = incorrectAnswers.map((answer) => answer.questionId);

        // 不正解の問題が存在しない場合のエラーハンドリング
        if (incorrectQuestionIds.length === 0) {
            return NextResponse.json({ message: "不正解の問題がありません" }, { status: 404 });
        }

        // 不正解の問題を取得
        const questions = await prisma.question.findMany({
            where: {
                id: {
                    in: incorrectQuestionIds, // 不正解問題IDのみ
                },
            },
        });

        // ランダムに最大10問を選択
        const shuffledQuestions = questions.sort(() => 0.5 - Math.random());
        const selectedQuestions = shuffledQuestions.slice(0, Math.min(10, shuffledQuestions.length));

        return NextResponse.json({ questions: selectedQuestions });
    } catch {
        return NextResponse.json({ message: "サーバーエラーが発生しました" }, { status: 500 });
    }
}
