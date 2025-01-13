/* 生徒削除用API */

'use server';

import { NextResponse } from "next/server";
import { prisma } from "@/lib/PrismaProvider";

export async function POST(request: Request) {
    try {
        
        const { studentId } = await request.json();

        if (!studentId) {
            return NextResponse.json(
                { success: false, message: "生徒IDが指定されていません。" },
                { status: 400 }
            );
        }

        // 生徒が存在するか確認
        const student = await prisma.student.findUnique({
            where: { id: studentId },
        });

        if (!student) {
            return NextResponse.json(
                { success: false, message: "指定された生徒が見つかりません。" },
                { status: 404 }
            );
        }

        // 生徒を物理削除
        await prisma.student.delete({
            where: { id: studentId },
        });

        return NextResponse.json({
            success: true,
            message: "生徒を削除しました。",
        });
    } catch (error) {
        return NextResponse.json(
            { success: false, message: `生徒の削除中にエラーが発生しました。(${error})` },
            { status: 500 }
        );
    } finally {
        await prisma.$disconnect();
    }
}
