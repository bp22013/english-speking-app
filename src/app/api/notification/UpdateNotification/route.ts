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
            return NextResponse.json({ error: "通知IDと管理者メールが必要です" }, { status: 400 });
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
                adminId: admin.id  // 管理者自身が作成した通知のみ変更可能
            },
        });

        if (!notification) {
            return NextResponse.json({ error: "通知が存在しないか、削除権限がありません" }, { status: 404 });
        }

        // 通知を物理変更
        await prisma.notification.update({
            where: { id: notificationId },
            data: { message: message }
        });

        return NextResponse.json({ message: "通知を更新しました" });
    } catch (error) {
        console.error("削除エラー:", error);
        return NextResponse.json({ error: "サーバーエラーが発生しました" }, { status: 500 });
    }
}