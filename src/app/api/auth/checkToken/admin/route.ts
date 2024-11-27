/* 管理者用トークン有効性チェックAPI */

'use server';

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";

export async function GET() {
    try {
        // next/headers でクッキーを取得
        const cookieStore = cookies();
        const token = (await cookieStore).get("admintoken")?.value;

        // トークンが存在しない場合
        if (!token) {
            return NextResponse.json(
                { error: "トークンが存在しません" },
                { status: 401 }
            );
        }

        // JWTシークレットキーを取得
        const secretKey = new TextEncoder().encode(
            process.env.NEXT_PUBLIC_JWT_SECRET || "default_secret"
        );

        // トークンの有効性をチェック
        const decodedJWT = await jwtVerify(token, secretKey);

        // 検証に成功した場合、ユーザー情報を返す
        return NextResponse.json(
            { user: decodedJWT.payload },
            { status: 200 }
        );
    } catch {
        // トークンが無効の場合
        return NextResponse.json(
            { error: "トークンの検証に失敗しました" },
            { status: 401 }
        );
    }
}
