/* 復習ページの問題を取得するAPI */

'use server';

import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// 配列をシャッフルする関数
const shuffleArray = <T>(array: T[]): T[] => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
};

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { studentId, level } = body;

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

        // 指定されたレベルの未回答または不正解の問題を取得
        const incorrectQuestions = await prisma.incorrectAssignedQuestion.findMany({
            where: {
                studentId: currentUserId,
                OR: [
                    { isAnswered: false },
                    { isCorrect: false },
                ],
                question: {
                    level: level,
                },
            },
            include: {
                question: true,
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

        // 問題をシャッフルして返す
        const shuffledQuestions = shuffleArray(questions);

        return NextResponse.json({ questions: shuffledQuestions });
    } catch (error) {
        console.error("Error fetching questions:", error);
        return NextResponse.json({ error: 'サーバーエラーが発生しました' }, { status: 500 });
    }
}
