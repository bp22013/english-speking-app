/* 管理者の情報を取得するAPI */

import { NextResponse } from "next/server";
import { prisma } from "@/lib/PrismaProvider";
import { cookies } from "next/headers";

export async function GET() {
    const cookie = cookies();
    try {

        const token = (await cookie).get("admintoken")?.value;

        //トークンが存在しているか確認
        if (!token) {
            return NextResponse.json(
                { error: "変更権限がありません" },
                { status: 401 }
            );
        }
        
        // 全ての管理者情報を取得
        const admins = await prisma.admin.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                createdAt: true,
            },
        });

        return NextResponse.json({
            success: true,
            admins,
        });
    } catch (error) {
        return NextResponse.json(
            { success: false, error: `管理者情報の取得に失敗しました。(${error})` },
            { status: 500 }
        );
    } finally {
        await prisma.$disconnect();
    }
}
