/* 生徒用ログアウトAPI */

'use server';

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { cookies } from 'next/headers';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {

    const cookie = cookies();

    try {
        // リクエストからトークン情報を取得
        const data = await request.json();
        const { studentId } = data;

        if (!studentId) {
            return NextResponse.json({ message: "studentIdが必要です", success: false });
        }

        // 該当するセッションを削除
        await prisma.studentAccount.deleteMany({
            where: {
                studentId,
                type: 'session', // セッションタイプを確認
            },
        });

        (await cookie).delete("studenttoken"); //クッキーからトークンを削除

        return NextResponse.json({
            message: "ログアウトしました",
            success: true,
        });
    } catch (error) {
        console.error('Logout error:', error);
        return NextResponse.json({ message: "サーバーエラーが発生しました", success: false });
    } finally {
        await prisma.$disconnect();
    }
}
