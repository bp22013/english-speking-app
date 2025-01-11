/* 管理者用名前変更API */

"use server";

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { cookies } from 'next/headers';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
    try {
        const cookie = cookies();
        const requestData = await request.json(); // JSONの読み取りは一度だけ行う

        const { newName, email } = requestData; // リクエストデータを展開

        const token = (await cookie).get("admintoken")?.value; // Cookieから管理者のトークンを取得

        if (!token) {
            return NextResponse.json({ message: "認証情報がありません", success: false }, { status: 401 });
        }

        // データベースの管理者名を更新
        const updatedAdmin = await prisma.admin.update({
            where: {
                email: email,
            },
            data: {
                name: newName,
            },
        });

        return NextResponse.json({ message: "名前を更新しました", success: true, updatedAdmin });
    } catch (error) {
        return NextResponse.json({ message: `サーバーエラーが発生しました（${error}）`, success: false }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}