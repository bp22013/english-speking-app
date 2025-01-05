/* パスワードリセット用API */

'use server';

import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import axios from 'axios';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { token, password } = body;

        if (!token || !password) {
            return NextResponse.json({ message: 'トークンまたはパスワードが必要です' }, { status: 400 });
        }

        // Clerk のトークンを検証
        const response = await axios.get(`https://api.clerk.dev/v1/passwords/reset/verify?token=${token}`, {
            headers: {
                Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
            },
        });

        const { email_address } = response.data;

        // パスワードをハッシュ化
        const hashedPassword = await bcrypt.hash(password, 10);

        // データベースのパスワードを更新
        await prisma.admin.update({
            where: { email: email_address },
            data: { hashedPassword: hashedPassword },
        });

        return NextResponse.json({ message: 'パスワードをリセットしました' });
    } catch (error) {
        console.error('エラーが発生しました:', error);
        return NextResponse.json({ message: 'トークンが無効です' }, { status: 400 });
    } finally {
        await prisma.$disconnect();
    }
}
