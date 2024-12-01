/* 仕分けページの問題を取得するAPI */

'use server';

import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
    try {
        // 既にANSWERテーブルに存在するquestionIDを取得
        const answeredQuestionIds = await prisma.answer.findMany({
            select: {
                questionId: true,
            },
        });

        // 回答済みのquestionIDを配列に変換
        const answeredIds = answeredQuestionIds.map((answer) => answer.questionId);

        // 回答済みでない問題を取得
        const availableQuestions = await prisma.question.findMany({
            where: {
                id: {
                    notIn: answeredIds, // 回答済みでない問題
                },
            },
        });

        // ランダムに最大10問を選択（回答可能な問題が10問以下でもすべて出題）
        const shuffledQuestions = availableQuestions.sort(() => 0.5 - Math.random());
        const selectedQuestions = shuffledQuestions.slice(0, Math.min(10, shuffledQuestions.length));

        return NextResponse.json({ questions: selectedQuestions });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "問題の取得に失敗しました" }, { status: 500 });
    }
}
