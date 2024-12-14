/* 通知を作成するAPI */

'use server';

import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: Request) {
    try {
        const { message, email } = await request.json();

        // 必要なデータのチェック
        if (!message || !email) {
            return NextResponse.json({ error: "メッセージと管理者メールが必要です" }, { status: 400 });
        }

        // 管理者の確認
        const admin = await prisma.admin.findUnique({
            where: { email },
        });

        if (!admin) {
            return NextResponse.json({ error: "管理者権限がありません" }, { status: 403 });
        }

        // 全ての生徒を取得
        const students = await prisma.student.findMany();

        // 一括通知の作成
        await prisma.notification.createMany({
            data: students.map(student => ({
                message: message,
                adminId: admin.id,
                studentId: student.id,
                isRead: false
            }))
        });

        return NextResponse.json({ 
            message: `生徒に通知を送信しました`,
        });
    } catch (error) {
        console.error("一括通知作成エラー:", error);
        return NextResponse.json({ error: "サーバーエラーが発生しました" }, { status: 500 });
    }
}