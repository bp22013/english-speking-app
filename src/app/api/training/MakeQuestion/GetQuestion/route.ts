/* 問題作成ページの問題情報を取得するAPI */

import { NextResponse } from "next/server";
import { prisma } from "@/lib/PrismaProvider";

export async function POST(request: Request) {
    try {
        // リクエストボディから検索クエリと並び替えオプションを取得
        const body = await request.json();
        const { page = 1, limit = 10, searchQuery = "", sortOption = "createdAt-desc" } = body;

        const pageNumber = parseInt(page, 10);
        const pageSize = parseInt(limit, 10);

        if (isNaN(pageNumber) || isNaN(pageSize)) {
            return NextResponse.json({ error: "無効なページ情報です。" }, { status: 400 });
        }

        // 全データを取得
        let questions = await prisma.question.findMany({
            select: {
                id: true,
                text: true,
                correctAnswer: true,
                level: true,
                adminId: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        // 検索フィルタ
        if (searchQuery.trim() !== "") {
            const query = searchQuery.toLowerCase();
            questions = questions.filter((q) =>
                q.text.toLowerCase().includes(query) ||
                (q.correctAnswer ?? "").toLowerCase().includes(query)
            );
        }

        // 並び替え処理
        switch (sortOption) {
            case "createdAt-desc":
                questions.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
                break;
            case "createdAt-asc":
                questions.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
                break;
            case "text-asc":
                questions.sort((a, b) => a.text.localeCompare(b.text));
                break;
            case "text-desc":
                questions.sort((a, b) => b.text.localeCompare(a.text));
                break;
            case "level-asc":
                questions.sort((a, b) => a.level - b.level);
                break;
            case "level-desc":
                questions.sort((a, b) => b.level - a.level);
                break;
            default:
                break;
        }

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
            adminName: adminMap[question.adminId] || "不明",
        }));

        // ページング処理
        const totalQuestions = formattedQuestions.length;
        const totalPages = Math.ceil(totalQuestions / pageSize);
        const paginatedQuestions = formattedQuestions.slice((pageNumber - 1) * pageSize, pageNumber * pageSize);

        return NextResponse.json({
            allQuestions: formattedQuestions, // ページネーション関係なく全件
            questions: paginatedQuestions, // ページネーション対象
            totalPages,
            currentPage: pageNumber,
            totalQuestions,
        });
    } catch (error) {
        console.error("Error fetching questions:", error);
        return NextResponse.json(
            { error: "サーバーエラーが発生しました。" },
            { status: 500 }
        );
    }
}
