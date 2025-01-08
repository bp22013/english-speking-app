/* 通知を作成するAPI */

'use server';

import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: Request) {
    try {
        const { notificationId, message, email } = await request.json();

        // 必要なデータのチェック
        if (!notificationId || !message || !email) {
            return NextResponse.json({ error: "通知ID、メッセージ、および管理者メールが必要です" }, { status: 400 });
        }

        // 管理者の確認
        const admin = await prisma.admin.findUnique({
            where: { email },
        });

        if (!admin) {
            return NextResponse.json({ error: "管理者権限がありません" }, { status: 403 });
        }

        // 通知の存在確認と所有権の検証
        const notification = await prisma.notification.findUnique({
            where: {
                id: notificationId,
                adminId: admin.id, // 管理者自身が作成した通知のみ変更可能
            },
        });

        if (!notification) {
            return NextResponse.json({ error: "通知が存在しないか、変更権限がありません" }, { status: 404 });
        }

        // 通知のメッセージを取得
        const selectMessage = await prisma.notification.findUnique({
            where: { id: notificationId },
            select: { message: true },
        });

        if (!selectMessage || !selectMessage.message) {
            return NextResponse.json({ error: "既存のメッセージが見つかりません" }, { status: 404 });
        }

        // 通知を更新
        await prisma.notification.updateMany({
            where: { message: selectMessage.message },
            data: { message: message, isRead: false },
        });

        return NextResponse.json({ message: "通知を更新しました" });
    } catch (error) {
        console.error("更新エラー:", error);
        return NextResponse.json({ error: "サーバーエラーが発生しました" }, { status: 500 });
    }
}
