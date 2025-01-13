/* 管理者削除用API */

'use server';

import { NextResponse } from "next/server";
import { prisma } from "@/lib/PrismaProvider";

export async function POST(request: Request) {
    try {
        // リクエストから adminId を取得
        const { email } = await request.json();

        if (!email) {
            return NextResponse.json(
                { success: false, message: "管理者IDが指定されていません。" },
                { status: 400 }
            );
        }

        // 管理者が存在するか確認
        const admin = await prisma.admin.findUnique({
            where: { email: email },
        });

        if (!admin) {
            return NextResponse.json(
                { success: false, message: "指定された管理者が見つかりません。" },
                { status: 404 }
            );
        }

        // 管理者を物理削除
        await prisma.admin.delete({
            where: { email: email },
        });

        return NextResponse.json({
            success: true,
            message: "管理者を削除しました。",
        });
    } catch (error) {
        return NextResponse.json(
            { success: false, message: `管理者の削除中にエラーが発生しました。(${error})` },
            { status: 500 }
        );
    } finally {
        await prisma.$disconnect();
    }
}
