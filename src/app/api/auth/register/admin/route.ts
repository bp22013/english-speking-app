/* 管理者新規登録API */

'use server';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/PrismaProvider';
import { cookies } from 'next/headers';
import bcrypt from 'bcrypt';
import { add } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';

export async function POST(request: NextRequest) {

    const strech = 10; //bcryptのhashストレッチ
    const cookie = cookies();

    try {
        // リクエストデータの解析
        const data = await request.json();
        const { email, name, password } = data;

        const token = (await cookie).get("admintoken")?.value;

        //トークンが存在しているか確認
        if (!token) {
            return NextResponse.json(
                { error: "変更権限がありません" },
                { status: 401 }
            );
        }

        // 必須項目のチェック
        if (!email || !name || !password) {
            return NextResponse.json(
                { message: "すべてのフィールドを入力してください", success: false },
                { status: 400 }
            );
        }

        // パスワードのハッシュ化
        const hashedPassword = await bcrypt.hash(password, strech);

        //UTCを日本時間に変換
        const now = new Date();
        const japanTime = add(toZonedTime(now, 'Asia/Tokyo'), { hours:9 });

        // データベースに新規管理者情報を作成
        const newAdmin = await prisma.admin.create({
            data: {
                email: email,
                name: name,
                hashedPassword: hashedPassword,
                createdAt: japanTime,
                updatedAt: new Date(),
            },
        });

        return NextResponse.json(
            { message: "管理者が正常に登録されました", success: true, newAdmin },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error creating student:", error);
        return NextResponse.json(
            { message: "サーバーエラーが発生しました", success: false },
            { status: 500 }
        );
    } finally {
        await prisma.$disconnect();
    }
}
