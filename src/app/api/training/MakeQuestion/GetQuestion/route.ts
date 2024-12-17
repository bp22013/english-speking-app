/* 問題作成ページの問題情報を取得するAPI */

'use server';

import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: Request) {
    try {
        // リクエストボディからページとリミット情報を取得
        const body = await request.json();
        const { page = 1, limit = 10 } = body; // デフォルト値: page=1, limit=10

        const pageNumber = parseInt(page, 10);
        const pageSize = parseInt(limit, 10);

        if (isNaN(pageNumber) || isNaN(pageSize)) {
            return NextResponse.json({ error: "無効なページ情報です。" }, { status: 400 });
        }

        // データを取得（ページング対応）
        const questions = await prisma.question.findMany({
            skip: (pageNumber - 1) * pageSize,
            take: pageSize,
            select: {
                id: true, // UUIDで管理される問題ID
                text: true, // 問題文
                correctAnswer: true, // 正解
                adminId: true, // 管理者のID
                createdAt: true, // 作成日時
                updatedAt: true, // 更新日時
            },
            orderBy: { createdAt: "desc" }, // 作成日時順に並び替え
        });

        // Admin テーブルから名前を取得して質問に結合
        const adminIds = [...new Set(questions.map((q) => q.adminId))];
        const admins = await prisma.admin.findMany({
            where: { id: { in: adminIds } },
            select: { id: true, name: true },
        });

        const adminMap = admins.reduce((acc, admin) => {
            acc[admin.id] = admin.name || "不明";
            return acc;
        }, {} as Record<string, string>);

        // レスポンスデータのフォーマット
        const formattedQuestions = questions.map((question) => ({
            ...question,
            adminName: adminMap[question.adminId] || "不明", // 管理者の名前を結合
        }));

        // 総件数を取得してページ総数を計算
        const totalQuestions = await prisma.question.count();
        const totalPages = Math.ceil(totalQuestions / pageSize);

        return NextResponse.json({
            questions: formattedQuestions,
            totalPages,
            currentPage: pageNumber,
        });
    } catch {
        return NextResponse.json({ error: "サーバーエラーが発生しました。" }, { status: 500 });
    }
}
