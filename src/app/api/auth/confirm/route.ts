/* 管理者用パスワード確認API */

'use server';

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
    try {
        const data = await request.json();
        const { email, password } = data;

        // 必須項目のチェック
        if (!email || !password) {
            return NextResponse.json({ message: "メールアドレスまたはパスワードが入力されていません", success: false }, { status: 400 });
        }

        // データベースから管理者情報を取得
        const admin = await prisma.admin.findUnique({
            where: {
                email: email,
            },
        });

        if (!admin) {
            return NextResponse.json({ message: "管理者が見つかりません", success: false }, { status: 404 });
        }

        // bcryptでパスワードを比較
        const isPasswordValid = await bcrypt.compare(password, admin.hashedPassword as string);
        if (!isPasswordValid) {
            return NextResponse.json({ message: "パスワードが正しくありません", success: false }, { status: 401 });
        }

        return NextResponse.json({ message: "パスワードが確認されました", success: true }, { status: 200 });

    } catch (error) {
        console.error("Error confirming password:", error);
        return NextResponse.json({ message: "サーバーエラーが発生しました", success: false }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}
