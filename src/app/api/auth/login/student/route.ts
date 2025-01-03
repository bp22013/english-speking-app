/* 生徒用ログインAPI */

'use server';

import { NextRequest, NextResponse } from 'next/server';
import { SignJWT } from 'jose';
import { PrismaClient } from '@prisma/client';
import { add } from 'date-fns';
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
        now.setHours(now.getHours() + 9);

        const updateAt = await prisma.student.findUnique({
            where: { studentId: data.studentId },
            select: { updatedAt: true }
        });

        const formattedUpdatedAt = updateAt?.updatedAt
            ? `${updateAt.updatedAt.getFullYear()} / ${String(updateAt.updatedAt.getMonth() + 1).padStart(2, '0')} / ${String(updateAt.updatedAt.getDate() - 1).padStart(2, '0')}`
            : null;

        const payload = {
            Id: student.id,
            studentId: student.studentId,
            username: student.name,
            updateAt: formattedUpdatedAt, 
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
                updatedAt: new Date(now)
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
        const expirationDate = add(now, { days: 1 });
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
