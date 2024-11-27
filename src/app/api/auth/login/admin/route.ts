/* 管理者用ログインAPI */

'use server';

import { NextRequest, NextResponse } from 'next/server';
import { SignJWT } from 'jose';
import { PrismaClient } from '@prisma/client';
import { add } from 'date-fns';
import { cookies } from 'next/headers';
import { toZonedTime, format } from 'date-fns-tz';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
    const data = await request.json();
    const cookie = cookies();

    try {
        const admin = await prisma.admin.findUnique({
            where: { email: data.email }
        });

        if (!admin) {
            return NextResponse.json({ message: "ユーザーが存在しません", flg: false });
        }

        // bcryptでパスワードを比較
        const isPasswordValid = await bcrypt.compare(data.password, admin.hashedPassword as string);
        if (!isPasswordValid) {
            return NextResponse.json({ message: "パスワードが間違っています", flg: false });
        }

        const secretKey = new TextEncoder().encode(process.env.NEXT_PUBLIC_JWT_SECRET || "default_secret");

        const payload = {
            email: admin.email,
            username: admin.name,
            adminId: admin.id
        };

        //トークンを新規作成
        const token = await new SignJWT(payload)
            .setProtectedHeader({ alg: "HS256" })
            .setExpirationTime("1d")
            .sign(secretKey);

        // 日本時間の現在時刻を取得しUTCに変換
        const now = new Date();
        const japanTime = toZonedTime(now, 'Asia/Tokyo');
        const formattedJapanTime = format(japanTime, "yyyy-MM-dd'T'HH:mm:ss.SSSXXX");
        const japanformattedtime = add(formattedJapanTime, { hours: 9 }); //UTCより9時間ずらして保存

        // updatedAt を日本時間で更新
        await prisma.admin.updateMany({
            where: {
                email: data.email,
            },
            data: {
                updatedAt: new Date(japanformattedtime)
            }
        });

        // 既存のアカウントセッション情報を削除
        await prisma.adminAccount.deleteMany({
            where: {
                adminId: admin.id,
                type: 'session'
            }
        });

        const oldtoken = (await cookie).has("admintoken");

        // 古い管理者用JWTトークンがあれば削除する
        if (oldtoken) {
            (await cookie).delete("admintoken");
        }

        (await cookie).set("admintoken", token); // クッキーにトークンを保存

        // 新しいセッション情報をAdminAccountに登録
        const expirationDate = add(japanformattedtime, { days: 1 });
        await prisma.adminAccount.create({
            data: {
                adminId: admin.id,
                type: 'session',
                Adminprovider: 'jwt',
                AdminproviderAccountId: admin.id,
                accessToken: token,
                expiresAt: expirationDate,
                tokenType: 'Bearer'
            }
        });

        return NextResponse.json({
            message: "ログインしました",
            flg: true
        });

    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json({ message: "サーバーエラーが発生しました", flg: false });

    } finally {
        await prisma.$disconnect();
    }
}
