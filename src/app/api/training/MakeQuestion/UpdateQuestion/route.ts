/* 問題作成ページの問題を更新するAPI */

'use server';

import { NextResponse } from "next/server";
import { prisma } from "@/lib/PrismaProvider";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { id, text, correctAnswer, level } = body;

        // パラメータの検証
        if (typeof id !== "string" || id.trim() === "" || typeof text !== "string" || text.trim() === "" ||
            typeof correctAnswer !== "string" || correctAnswer.trim() === "" || typeof level !== "number") {
            return NextResponse.json({ error: "有効なパラメータを指定してください。" }, { status: 400 });
        }

        // データの存在確認
        const question = await prisma.question.findUnique({
            where: { id },
        });

        if (!question) {
            return NextResponse.json({ error: "指定された問題が見つかりません。" }, { status: 404 });
        }

        // 現在時刻に6時間を加算
        const updatedAt = new Date();
        updatedAt.setHours(updatedAt.getHours() + 9);

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
                level,
                updatedAt, // 加算済みの更新日時を記録
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
