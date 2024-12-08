/* 復習ページの問題を送信するAPI */

'use server';

import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { questionId, studentId, userAnswer } = body;

        if (!studentId || !questionId || userAnswer === undefined) {
            return NextResponse.json(
                { error: "全てのパラメータを入力してください" },
                { status: 400 }
            );
        }

        // 学生情報を取得
        const student = await prisma.student.findUnique({
            where: { studentId },
            select: { id: true },
        });

        if (!student) {
            return NextResponse.json(
                { error: "生徒が見つかりませんでした: " + studentId },
                { status: 400 }
            );
        }

        // 学生IDを取得
        const currentUserId = student.id;

        // 問題の正解を取得
        const question = await prisma.question.findUnique({
            where: { id: questionId },
        });

        if (!question) {
            return NextResponse.json({ error: "問題が見つかりません" }, { status: 404 });
        }

        // 正解か不正解かを判定
        const isCorrect = question.correctAnswer === userAnswer;

        const correctAnswer = question.correctAnswer;

        if (isCorrect) {
            // 正解の場合、テーブルから削除
            await prisma.incorrectAssignedQuestion.deleteMany({
                where: {
                    studentId: currentUserId,
                    questionId: questionId,
                },
            });
            return NextResponse.json({ message: "正解です！" , flag: true , correctAnswer: correctAnswer});
        } else {
            // 不正解の場合、回答情報を更新
            const updatedQuestions = await prisma.incorrectAssignedQuestion.updateMany({
                where: {
                    studentId: currentUserId,
                    questionId: questionId,
                },
                data: {
                    isAnswered: true,
                    isCorrect: false,
                    answeredAt: new Date(),
                },
            });

            if (updatedQuestions.count === 0) {
                return NextResponse.json(
                    { error: "問題が更新できませんでした" },
                    { status: 404 }
                );
            }

            return NextResponse.json({ message: "不正解です", correctAnswer: question.correctAnswer, flag: false });
        }
    } catch {
        return NextResponse.json(
            { error: "サーバーエラーが発生しました。" },
            { status: 500 }
        );
    }
}
