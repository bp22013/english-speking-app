/* 通知を既読にするAPI */

"use server";

import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { notificationId, email } = body;

        // 必要なデータが存在しない場合
        if (!notificationId || !email) {
            return NextResponse.json(
                { error: "通知IDと管理者権限が必要です" },
                { status: 400 }
            );
        }

        // 生徒IDを取得
        const adminRecord = await prisma.admin.findUnique({
            where: {
                email: email,
            },
            select: {
                id: true,
            },
        });

        if (!adminRecord) {
            return NextResponse.json(
                { error: "管理者が存在しません: "},
                { status: 404 }
            );
        }

        const currentId = adminRecord.id;

        // 通知が存在し、指定された生徒IDに関連付けられているか確認
        const notification = await prisma.notification.findFirst({
            where: {
                id: notificationId, // `id` は文字列型
                adminId: currentId,
            },
        });

        if (!notification) {
            return NextResponse.json(
                { error: "指定された通知IDが存在しません" },
                { status: 404 }
            );
        }

        // 通知を既読に更新
        await prisma.notification.update({
            where: { id: notificationId },
            data: { isRead: true },
        });

        return NextResponse.json({ message: "通知を既読にしました" });
    } catch {
        return NextResponse.json(
            { error: "サーバーエラーが発生しました" },
            { status: 500 }
        );
    }
}
