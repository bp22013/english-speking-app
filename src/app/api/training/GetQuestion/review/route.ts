/* 復習ページの問題を取得するAPI */

'use server';

import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
    try {
        // ANSWERテーブルからisCorrectがtrueの問題IDを取得
        const correctAnswers = await prisma.answer.findMany({
            where: {
                isCorrect: true, // 正解のみ
            },
            select: {
                questionId: true, // questionIdのみ取得
            },
        });

        // 正解済みの問題IDを配列に変換
        const correctQuestionIds = correctAnswers.map((answer) => answer.questionId);

        // 正解済みの問題が存在しない場合のエラーハンドリング
        if (correctQuestionIds.length === 0) {
            return NextResponse.json({ error: "正解済みの問題がありません" }, { status: 404 });
        }

        // 正解済みの問題を取得
        const questions = await prisma.question.findMany({
            where: {
                id: {
                    in: correctQuestionIds, // 正解済み問題IDのみ
                },
            },
        });

        // ランダムに最大10問を選択
        const shuffledQuestions = questions.sort(() => 0.5 - Math.random());
        const selectedQuestions = shuffledQuestions.slice(0, Math.min(10, shuffledQuestions.length));

        return NextResponse.json({ questions: selectedQuestions });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "問題の取得に失敗しました" },
            { status: 500 }
        );
    }
}
