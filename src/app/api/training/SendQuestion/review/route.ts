/* 復習ページの送信API */

'use server';

import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: Request) {
    try {
        // リクエストからデータを取得
        const { questionId, submittedAnswer, studentId } = await request.json();

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

        // ANSWERテーブルから既に解答済みのレコードを取得
        const existingAnswer = await prisma.answer.findFirst({
            where: {
                questionId: questionId,
                studentId: currentUserId,
            },
        });

        if (!existingAnswer) {
            // 解答が存在しない場合
            return NextResponse.json(
                { error: "対象の解答が見つかりません" },
                { status: 404 }
            );
        }

        // 問題の正解を取得
        const question = await prisma.question.findUnique({
            where: {
                id: questionId,
            },
        });

        if (!question) {
            // 問題が存在しない場合
            return NextResponse.json(
                { error: "問題が見つかりません" },
                { status: 404 }
            );
        }

        // 解答の正誤判定
        const isCorrect = question.correctAnswer === submittedAnswer;

        if (!isCorrect && existingAnswer.isCorrect) {
            // 回答が間違っていて、isCorrectがtrueの場合にfalseに更新
            await prisma.answer.update({
                where: {
                    id: existingAnswer.id, // 対象のANSWERレコード
                },
                data: {
                    isCorrect: false,
                },
            });

            return NextResponse.json({
                message: "不正解です。",
                isCorrect: false,
            });
        }

        // 正しい場合は何もせずそのまま返す
        return NextResponse.json({
            message: isCorrect
                ? "正解です！"
                : "不正解です。",
            isCorrect: isCorrect,
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "サーバーエラーが発生しました" },
            { status: 500 }
        );
    }
}
