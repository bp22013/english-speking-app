/* 問題作成ページの問題を削除するAPI */

'use server';

import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { id } = body;

        // ID の検証
        if (typeof id !== "string" || id.trim() === "") {
            return NextResponse.json({ error: "有効な問題IDを指定してください。" }, { status: 400 });
        }

        // データの存在確認
        const question = await prisma.question.findUnique({
            where: { id },
        });
        
        if (!question) {
            return NextResponse.json({ error: "指定された問題が見つかりません。" }, { status: 404 });
        }

        // 関連データを削除（Questionテーブルを参照している為）
        await prisma.assignedQuestion.deleteMany({
            where: { questionId: id },
        });

        // 問題を削除
        await prisma.question.delete({
            where: { id },
        });

        return NextResponse.json({ success: true, message: "問題が削除されました。" });
    } catch (error) {
        console.error("Error deleting question:", error);
        return NextResponse.json({ success: false, error: "サーバーエラーが発生しました。" }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}
