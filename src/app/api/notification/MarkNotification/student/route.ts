/* 通知を既読にするAPI */

"use server";

import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { notificationId, studentId } = body;

        // 必要なデータが存在しない場合
        if (!notificationId || !studentId) {
            return NextResponse.json(
                { error: "通知IDと生徒IDが必要です" },
                { status: 400 }
            );
        }

        // 生徒IDを取得
        const studentRecord = await prisma.student.findUnique({
            where: {
                studentId: studentId,
            },
            select: {
                id: true,
            },
        });

        if (!studentRecord) {
            return NextResponse.json(
                { error: "生徒IDが存在しません: " + studentId },
                { status: 404 }
            );
        }

        const currentId = studentRecord.id;

        // 通知が存在し、指定された生徒IDに関連付けられているか確認
        const notification = await prisma.notification.findFirst({
            where: {
                id: notificationId, // `id` は文字列型
                studentId: currentId,
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
    } catch (error) {
        console.error("Error marking notification as read:", error);
        return NextResponse.json(
            { error: "サーバーエラーが発生しました" },
            { status: 500 }
        );
    }
}
