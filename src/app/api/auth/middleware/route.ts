/* ミドルウェア用API */

import { NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // 管理者ルートの保護
    if (pathname.startsWith("/Admindashboard")) {
        const adminToken = request.cookies.get("admintoken")?.value;

        if (!adminToken) {
            // トークンがない場合はログインページにリダイレクト
            return NextResponse.redirect(new URL("/", request.url));
        }

        try {
            const secretKey = new TextEncoder().encode(process.env.NEXT_PUBLIC_JWT_SECRET || "default_secret");
            await jwtVerify(adminToken, secretKey);
        } catch {
            // トークンが無効な場合はログインページにリダイレクト
            return NextResponse.redirect(new URL("/", request.url));
        }
    }

    // 生徒ルートの保護
    if (pathname.startsWith("/dashboard")) {
        const studentToken = request.cookies.get("studenttoken")?.value;

        if (!studentToken) {
            // トークンがない場合はログインページにリダイレクト
            return NextResponse.redirect(new URL("/", request.url));
        }

        try {
            const secretKey = new TextEncoder().encode(process.env.NEXT_PUBLIC_JWT_SECRET || "default_secret");
            await jwtVerify(studentToken, secretKey);
        } catch {
            // トークンが無効な場合はログインページにリダイレクト
            return NextResponse.redirect(new URL("/", request.url));
        }
    }

    return NextResponse.next(); // 正常に進む
}

export const config = {
    matcher: [
        "/Admindashboard/:path*", // 管理者用保護対象ルート
        "/dashboard/:path*", // 生徒用保護対象ルート
    ],
};