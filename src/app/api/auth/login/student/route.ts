/* 生徒用ログインAPI */

'use server';

import { NextRequest, NextResponse } from 'next/server';
import { SignJWT } from 'jose';
import { PrismaClient } from '@prisma/client';
import { add } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';
import bcrypt from 'bcrypt';
import { cookies } from 'next/headers';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
    const data = await request.json();
    const cookie = cookies();

    try {
        const student = await prisma.student.findUnique({
            where: { studentId: data.studentId }
        });

        if (!student) {
            return NextResponse.json({ message: "ユーザーが存在しません", flg: false });
        }

        // bcryptを使用してパスワードを比較
        const isPasswordValid = await bcrypt.compare(data.password, student.hashedPassword);
        if (!isPasswordValid) {
            return NextResponse.json({ message: "パスワードが間違っています", flg: false });
        }

        const secretKey = new TextEncoder().encode(process.env.NEXT_PUBLIC_JWT_SECRET || "default_secret");

        // 日本時間の現在時刻を取得しUTCに変換
        const now = new Date();
        const japanTime = add(toZonedTime(now, 'Asia/Tokyo'), { hours: 9 });

        const update_time = student.updatedAt || new Date();

        const payload = {
            Id: student.id,
            studentId: student.studentId,
            username: student.name,
            updateAt_year: update_time.getFullYear(),
            updateAt_month: update_time.getMonth() + 1,
            updateAt_day: update_time.getDate(),
        };

        const token = await new SignJWT(payload)
            .setProtectedHeader({ alg: "HS256" })
            .setExpirationTime("1d")
            .sign(secretKey);

        // updatedAt を日本時間で更新
        await prisma.student.updateMany({
            where: {
                studentId: data.studentId
            },
            data: {
                updatedAt: new Date(japanTime)
            }
        });

        // 既存のアカウントセッション情報を削除
        await prisma.studentAccount.deleteMany({
            where: {
                studentId: student.id,
                type: 'session'
            }
        });

        const oldtoken = (await cookie).has("studenttoken");

        //古い生徒用JWTトークンがあれば削除する
        if (oldtoken) {
            (await cookie).delete("studenttoken");
        }

        // 新しいトークンをCookieに設定
        (await cookie).set("studenttoken", token);

        // 新しいセッション情報をStudentAccountに登録
        const expirationDate = add(japanTime, { days: 1 });
        await prisma.studentAccount.create({
            data: {
                studentId: student.id,
                type: 'session',
                Studentprovider: 'jwt',
                StudentproviderAccountId: student.id,
                accessToken: token,
                expiresAt: expirationDate,
                tokenType: 'Bearer'
            }
        });

        return NextResponse.json({
            message: "ログインしました",
            flg: true,
            token: token
        });

    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json({ message: "サーバーエラーが発生しました", flg: false });

    } finally {
        await prisma.$disconnect();
    }
}
