/* ドリルページの送信API */

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

        // 学生IDを取得
        const currentUserId = student.id;

        // 既に解答済みでisCorrectがfalseのレコードを取得
        const existingAnswer = await prisma.answer.findFirst({
            where: {
                questionId: questionId,
                studentId: currentUserId,
                isCorrect: false, // isCorrectがfalseのもののみ
            },
        });

        if (!existingAnswer) {
            // 解答済みかつisCorrectがfalseのエントリが存在しない場合
            return NextResponse.json(
                { error: "更新対象の解答が見つかりません" },
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

        // 解答が正しいかどうかを確認
        const isCorrect = question.correctAnswer === submittedAnswer;

        // ANSWERテーブルを更新
        if (isCorrect) {
            await prisma.answer.update({
                where: {
                    id: existingAnswer.id, // 対象のANSWERレコード
                },
                data: {
                    isCorrect: true, // 正解に更新
                },
            });
        }

        // 結果を返す
        return NextResponse.json({
            message: isCorrect ? "正解です！" : "不正解です。",
            isCorrect: isCorrect,
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "解答の処理中にエラーが発生しました" },
            { status: 500 }
        );
    }
}
