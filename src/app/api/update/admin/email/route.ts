/* 管理者用メールアドレス変更API */

'use server';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/PrismaProvider';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
    try {
        const cookie = cookies();
        const requestData = await request.json(); // JSONの読み取りは一度だけ行う

        const { newEmail, confirmEmail, oldEmail } = requestData; // リクエストデータを展開

        // 入力のバリデーション
        if (!newEmail || !confirmEmail) {
            return NextResponse.json({ message: "すべてのフィールドを入力してください", success: false }, { status: 400 });
        }

        if (newEmail !== confirmEmail) {
            return NextResponse.json({ message: "上と同じメールアドレスを入力してください", success: false }, { status: 400 });
        }

        const token = (await cookie).get("admintoken")?.value; // Cookieから管理者のトークンを取得

        if (!token) {
            return NextResponse.json({ message: "認証情報がありません", success: false }, { status: 401 });
        }

        // データベースの管理者メールアドレスを更新
        const updatedAdmin = await prisma.admin.update({
            where: {
                email: oldEmail, // 以前のメールアドレスで管理者を検索
            },
            data: {
                email: newEmail, // 新しいメールアドレスに更新
            },
        });

        return NextResponse.json({ message: "メールアドレスを更新しました", success: true, updatedAdmin });
    } catch (error) {
        return NextResponse.json({ message: `サーバーエラーが発生しました（${error}）`, success: false }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}
