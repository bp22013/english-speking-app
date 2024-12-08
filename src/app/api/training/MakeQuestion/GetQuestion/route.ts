/* 問題作成ページの問題情報を取得するAPI */

'use server';

import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: Request) {
    try {
        // ページングのクエリパラメータを取得
        const url = new URL(request.url);
        const pageParam = url.searchParams.get("page");
        const page = pageParam ? parseInt(pageParam, 10) : 1;
        const pageSize = 10; // 1ページあたりのデータ件数

        // データを取得（ページング対応）
        const questions = await prisma.question.findMany({
            skip: (page - 1) * pageSize,
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

        const formattedQuestions = questions.map((question) => ({
            ...question,
            adminName: adminMap[question.adminId] || "不明", // 管理者の名前を結合
        }));

        // 次のページがあるかを判定
        const totalQuestions = await prisma.question.count();
        const hasMore = page * pageSize < totalQuestions;

        return NextResponse.json({
            questions: formattedQuestions,
            hasMore,
            nextPage: hasMore ? page + 1 : null, // 次のページ番号を設定
        });
    } catch (error) {
        console.error("Error fetching questions:", error);
        return NextResponse.json({ error: "サーバーエラーが発生しました。" }, { status: 500 });
    }
}
