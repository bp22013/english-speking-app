/* 管理者用ログアウトAPI */

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
        const { email } = data;

        if (!email) {
            return NextResponse.json({ message: "ログインしていません", success: false });
        }

        // 該当するセッションを削除
        await prisma.adminAccount.deleteMany({
            where: {
                admin: {
                    email: email,
                },
                type: 'session', // セッションタイプを確認
            },
        });

        (await cookie).delete("admintoken"); //トークンを削除

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
