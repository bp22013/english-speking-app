/* ルート保護ミドルウェア */

import { NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { NextRequest } from "next/server";
import { cookies } from "next/headers";

// JWTトークンの検証とリダイレクト処理を関数化
async function verifyToken(cookieKey: string, secretKey: Uint8Array): Promise<boolean> {
    const cookie = cookies();
    const token = (await cookie).get(cookieKey)?.value;

    if (!token) {
        // トークンがない場合はリダイレクト
        return false;
    }

    try {
        await jwtVerify(token, secretKey);
        return true;
    } catch {
        // トークンが無効な場合はリダイレクト
        return false;
    }
}

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // 共通のJWTシークレットキーを取得
    const secretKey = new TextEncoder().encode(process.env.NEXT_PUBLIC_JWT_SECRET || "default_secret");

    // 管理者ルートの保護
    if (pathname.startsWith("/Admindashboard")) {
        const isAdminVerified = await verifyToken("admintoken", secretKey);

        if (!isAdminVerified) {
            return NextResponse.redirect(new URL("/", request.url));
        }
    }

    // 生徒ルートの保護
    if (pathname.startsWith("/dashboard")) {
        const isStudentVerified = await verifyToken("studenttoken", secretKey);

        if (!isStudentVerified) {
            return NextResponse.redirect(new URL("/", request.url));
        }
    }

    if (pathname.startsWith("/Admindashboard/setting/ChangeEmail")){
        const isAdminVerified = await verifyToken("admintoken", secretKey);

        if (!isAdminVerified) {
            return NextResponse.redirect(new URL("/", request.url));
        }

    }

    if (pathname.startsWith("/Admindashboard/setting/ChangePassword")) {
        const isAdminVerified = await verifyToken("admintoken", secretKey);

        if (!isAdminVerified) {
            return NextResponse.redirect(new URL("/", request.url));
        }
        
    }

    return NextResponse.next(); // 正常に進む
}

export const config = {
    matcher: [
        "/Admindashboard/:path*", // 管理者用保護対象ルート全般
        "/Admindashboard/setting/ChangeEmail", // 管理者メール変更保護
        "/Admindashboard/setting/ChangePassword", // 管理者パスワード変更保護
        "/dashboard/:path*", // 生徒用保護対象ルート全般
    ],
};
