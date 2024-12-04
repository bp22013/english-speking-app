/* 間違えた問題を解くページの問題を送信するAPI */

'use server';

import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { studentId } = body;

        // 学生情報を取得
        const student = await prisma.student.findUnique({
            where: { studentId },
            select: { id: true },
        });

        if (!student) {
            return NextResponse.json({ error: "生徒が見つかりませんでした: " + studentId }, { status: 400 });
        }

        // 学生IDを取得
        const currentUserId = student.id;

        // 未回答または不正解の問題を取得
        const incorrectQuestions = await prisma.incorrectAssignedQuestion.findMany({
            where: {
                studentId: currentUserId,
                OR: [
                    { isAnswered: false },
                    { isCorrect: false },
                ], // 未回答または不正解の問題を取得
            },
            include: {
                question: true, // 関連する問題の詳細を取得
            },
        });

        // 問題文を整形して返す
        const questions = incorrectQuestions.map((q) => ({
            id: q.question.id,
            text: q.question.text,
            correctAnswer: q.question.correctAnswer,
            isAnswered: q.isAnswered,
            isCorrect: q.isCorrect,
        }));

        return NextResponse.json({ questions });
    } catch (error) {
        console.error("Error fetching questions:", error);
        return NextResponse.json({ error: 'サーバーエラーが発生しました' }, { status: 500 });
    }
}
