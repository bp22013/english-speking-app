/* 問題作成ページの問題を更新するAPI */

'use server';

import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { id, text, correctAnswer } = body;

        // ID の検証
        if (typeof id !== "string" || id.trim() === "" || !text || !correctAnswer) {
            return NextResponse.json({ error: "有効なパラメータを指定してください。" }, { status: 400 });
        }

        // データの存在確認
        const question = await prisma.question.findUnique({
            where: { id },
        });

        if (!question) {
            return NextResponse.json({ error: "指定された問題が見つかりません。" }, { status: 404 });
        }

        // 関連データの更新 (例: assignedQuestion テーブルで該当する質問を関連付けるデータのフラグをリセット)
        await prisma.assignedQuestion.updateMany({
            where: { questionId: id },
            data: {
                isAnswered: false, // 関連データの例 (回答済みフラグをリセット)
                isCorrect: null,   // 正解フラグをリセット
            },
        });

        // 問題を更新
        const updatedQuestion = await prisma.question.update({
            where: { id },
            data: {
                text,
                correctAnswer,
                updatedAt: new Date(), // 更新日時を記録
            },
        });

        return NextResponse.json({
            success: true,
            message: "問題が更新されました。",
            question: updatedQuestion,
        });
    } catch (error) {
        console.error("Error updating question:", error);
        return NextResponse.json({ success: false, error: "サーバーエラーが発生しました。" }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}
