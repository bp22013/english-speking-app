'use server';

import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { cookies } from "next/headers";

const prisma = new PrismaClient();

export async function POST(request: Request) {
    try {
        const { studentId } = await request.json();

        // 生徒IDが無い場合
        if (!studentId) {
            return NextResponse.json(
                { error: "生徒IDが必要です" },
                { status: 400 }
            );
        }

        const cookie = cookies();
        const token = (await cookie).get("studenttoken");

        // JWTトークンが無い場合
        if (!token) {
            return NextResponse.json(
                { message: "権限がありません" },
                { status: 403 }
            );
        }

        // 生徒のレコードを取得
        const studentRecord = await prisma.student.findUnique({
            where: {
                studentId: studentId,
            },
            select: {
                id: true,
            },
        });

        // 生徒が見つからない場合
        if (!studentRecord) {
            return NextResponse.json(
                { error: "生徒が見つかりませんでした" },
                { status: 404 }
            );
        }

        // 新規通知の数を取得
        const unreadCount = await prisma.notification.count({
            where: {
                studentId: studentRecord.id,
                isRead: false, // 既読が`false`の通知
            },
        });

        return NextResponse.json({ unreadCount });
    } catch (error) {
        console.error("Error fetching unread notifications count:", error);
        return NextResponse.json(
            { error: "サーバーエラーが発生しました" },
            { status: 500 }
        );
    }
}
