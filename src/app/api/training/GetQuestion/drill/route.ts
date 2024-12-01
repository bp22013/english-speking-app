/* ドリルページの問題を取得するAPI */

'use server';

import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
    try {
        // ANSWERテーブルからisCorrectがFALSEの問題IDを取得
        const incorrectAnswers = await prisma.answer.findMany({
            where: {
                isCorrect: false, // 不正解のみ
            },
            select: {
                questionId: true,
            },
        });

        // 不正解の問題IDを配列に変換
        const incorrectQuestionIds = incorrectAnswers.map((answer) => answer.questionId);

        // 不正解の問題が存在しない場合のエラーハンドリング
        if (incorrectQuestionIds.length === 0) {
            return NextResponse.json({ error: "不正解の問題がありません" }, { status: 404 });
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
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "問題の取得に失敗しました" }, { status: 500 });
    }
}
