'use server';

import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: Request) {
    try {
        const { studentId, questionIds } = await request.json();

        // 入力値の検証
        if (!studentId || !Array.isArray(questionIds) || questionIds.length === 0) {
        return NextResponse.json(
            { error: "生徒IDまたは有効な問題IDが提供されていません" + questionIds },
            { status: 400 }
        );
        }

        // 学生情報を取得
        const student = await prisma.student.findUnique({
            where: { studentId },
            select: { id: true },
        });

        if (!student) {
        return NextResponse.json({ error: "生徒が見つかりませんでした: " + studentId }, { status: 404 });
        }

        // 学生IDを取得
        const currentUserId = student.id;

        // 回答した問題（questionIdsに基づく）を削除
        const deleteResult = await prisma.answer.deleteMany({
            where: {
                studentId: currentUserId,
                questionId: {
                    in: questionIds, // 解答した問題IDのみ削除
                },
            },
        });

        return NextResponse.json({
            message: `処理が完了しました`,
            deletedCount: deleteResult.count,
        });
    } catch (error) {
        console.error("回答データ削除エラー:", error);
        return NextResponse.json({ error: "回答データ削除に失敗しました" }, { status: 500 });
    }
}
