'use server';

import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { cookies } from "next/headers";

const prisma = new PrismaClient();

export async function POST(request: Request) {
    try {
        const { email } = await request.json();

        // 生徒IDが無い場合
        if (!email) {
            return NextResponse.json(
                { error: "権限が必要です" },
                { status: 400 }
            );
        }

        const cookie = cookies();
        const token = (await cookie).get("admintoken");

        // JWTトークンが無い場合
        if (!token) {
            return NextResponse.json(
                { message: "権限がありません" },
                { status: 403 }
            );
        }

        // 生徒のレコードを取得
        const adminRecord = await prisma.admin.findUnique({
            where: {
                email: email,
            },
            select: {
                id: true,
            },
        });

        // 生徒が見つからない場合
        if (!adminRecord) {
            return NextResponse.json(
                { error: "管理者が見つかりませんでした" },
                { status: 404 }
            );
        }

        // 新規通知の数を取得
        const unreadCount = await prisma.notification.count({
            where: {
                adminId: adminRecord.id,
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
