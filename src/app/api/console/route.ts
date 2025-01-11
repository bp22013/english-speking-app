/* 管理者の管理コンソール用情報取得API */

'use server';

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { cookies } from 'next/headers';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
    try {
        const { email } = await request.json();
        const cookie = cookies();

        const token = (await cookie).get("admintoken")?.value; // Cookieから管理者のトークンを取得

        if (!token) {
            return NextResponse.json({ message: "認証情報がありません", success: false }, { status: 401 });
        }

        const adminId = await prisma.admin.findUnique({
            where: { email: email },
            select: { id: true },
        });

        if (!adminId) {
            return NextResponse.json({ message: "認証情報がありません", success: false }, { status: 401 });
        }

        // 総問題数を取得
        const NumberOfQuestions = await prisma.question.count();

        // 総生徒数を取得
        const NumberOfStudent = await prisma.student.count();

        // 通知の総数を取得
        const totalNotifications = await prisma.notification.findMany({
            where: {
                adminId: adminId.id,
            },
        });

        const uniqueTotalNotifications = Array.from(
            new Map(totalNotifications.map(item => [item.message, item])).values()
        ).length; // 重複を排除した件数を計算

        return NextResponse.json({
            success: true,
            NumberOfQuestions,
            NumberOfNotifications: uniqueTotalNotifications,
            NumberOfStudent,
        });
    } catch (error) {
        return NextResponse.json({ message: `サーバーエラーが発生しました（${error}）`, success: false }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}
