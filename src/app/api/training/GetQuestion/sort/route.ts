/* 仕分けページの問題を取得するAPI */

'use server';

import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: Request) {
    try {
        // クライアントから生徒IDを取得
        const { studentId } = await request.json();

        if (!studentId) {
            return NextResponse.json({ error: "生徒IDが提供されていません" + studentId }, { status: 400 });
        }

        // studentId に基づいて学生のデータを取得
        const student = await prisma.student.findUnique({
            where: { studentId },
            select: { id: true },
        });

        if (!student) {
            return NextResponse.json(
                { error: "該当する学生が見つかりません" },
                { status: 404 }
            );
        }

        // 学生IDを取得
        const currentUserId = student.id;

        // 指定された生徒が解答済みのquestionIDを取得
        const answeredQuestionIds = await prisma.answer.findMany({
            where: {
                studentId: currentUserId, // 特定の生徒IDの回答履歴
            },
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
                    notIn: answeredIds, // 生徒が未解答の問題
                },
            },
        });

        // ランダムに最大10問を選択（未解答の問題が10問以下でもすべて出題）
        const shuffledQuestions = availableQuestions.sort(() => 0.5 - Math.random());
        const selectedQuestions = shuffledQuestions.slice(0, Math.min(10, shuffledQuestions.length));

        // JSON形式で未解答の問題を返す
        return NextResponse.json({ questions: selectedQuestions });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "サーバーエラーが発生しました" }, { status: 500 });
    }
}

