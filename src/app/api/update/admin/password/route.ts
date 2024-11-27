/* 管理者用パスワード変更API */

'use server';

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { cookies } from 'next/headers';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
    try {
        const cookie = cookies();
        const requestData = await request.json(); // JSONの読み取りは一度だけ行う

        const { newPassword, confirmPassword, email } = requestData; // リクエストデータを展開

        // 入力のバリデーション
        if (!newPassword || !confirmPassword) {
            return NextResponse.json({ message: "すべてのフィールドを入力してください", success: false }, { status: 400 });
        }

        if (newPassword !== confirmPassword) {
            return NextResponse.json({ message: "上と同じパスワードを入力してください", success: false }, { status: 400 });
        }

        const token = (await cookie).get("admintoken")?.value; // Cookieから管理者のトークンを取得

        if (!token) {
            return NextResponse.json({ message: "認証情報がありません", success: false }, { status: 401 });
        }

        // パスワードをハッシュ化
        const saltRounds = 10; // ストレッチングの強度を設定
        const newHashedPassword = await bcrypt.hash(newPassword, saltRounds);

        // データベースの管理者パスワードを更新
        const updatedAdmin = await prisma.admin.update({
            where: {
                email: email, // 以前のメールアドレスで管理者を検索
            },
            data: {
                hashedPassword: newHashedPassword, // ハッシュ化されたパスワードに更新
            },
        });

        return NextResponse.json({ message: "パスワードを更新しました", success: true, updatedAdmin });
    } catch (error) {
        console.error("Error updating password:", error);
        return NextResponse.json({ message: "サーバーエラーが発生しました", success: false }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}
