/* 管理者側で生徒の成績を取得するAPI */

'use server';

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/PrismaProvider";

export async function POST(request: NextRequest) {
    const body = await request.json();
    const { studentId } = body;

    try {
        // 生徒が存在するか確認
        const student = await prisma.student.findUnique({
            where: { studentId: studentId },
            select: { id: true },
        });

        if (!student) {
            return NextResponse.json(
                { error: "生徒が見つかりませんでした" },
                { status: 400 }
            );
        }

        // isCorrectがfalseの回答を取得し、対応する問題のレベルを取得
        const incorrectAnswers = await prisma.answer.findMany({
            where: {
                studentId: student.id,
                isCorrect: false,
            },
            select: {
                submittedAnswer: true,
                question: {
                    select: {
                        level: true,
                        text: true,
                        correctAnswer: true,
                    },
                },
            },
        });

        return NextResponse.json(
            {
                success: true,
                incorrectAnswers: incorrectAnswers.map((answer) => ({
                    submittedAnswer: answer.submittedAnswer,
                    level: answer.question.level,
                    correctAnswer: answer.question.correctAnswer,
                    questionText: answer.question.text,
                })),
            },
            { status: 200 }
        );

    } catch (error) {
        return NextResponse.json(
            { error: `サーバーエラーが発生しました。(${error})` },
            { status: 500 }
        );
    } finally {
        await prisma.$disconnect();
    }
}
