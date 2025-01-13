/* 生徒の情報を取得するAPI */

import { NextResponse } from "next/server";
import { prisma } from "@/lib/PrismaProvider";
import { cookies } from 'next/headers';

export async function GET() {
    const cookie = cookies();

    try {
        const token = (await cookie).get("admintoken")?.value; // Cookieから管理者のトークンを取得

        if (!token) {
            return NextResponse.json({ message: "認証情報がありません", success: false }, { status: 401 });
        }
        // 全ての生徒情報を取得
        const students = await prisma.student.findMany({
            select: {
                id: true,
                name: true,
                studentId: true,
                createdAt: true,
            },
        });

        return NextResponse.json({
            success: true,
            students,
        });
    } catch (error) {
        return NextResponse.json(
            { success: false, error: `生徒情報の取得に失敗しました。(${error})` },
            { status: 500 }
        );
    } finally {
        await prisma.$disconnect();
    }
}
