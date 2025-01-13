/* 生徒情報変更API */

'use server';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/PrismaProvider';

export async function POST(request: NextRequest) {
    try {
        const data = await request.json();
        const { studentId, newStudentId, newName } = data;

        // 必須項目のチェック
        if (!studentId || (!newStudentId && !newName)) {
            return NextResponse.json(
                { message: "フォームを全て入力してください", success: false },
                { status: 400 }
            );
        }

        // 学生情報の更新
        const updatedStudent = await prisma.student.update({
            where: { studentId },
            data: {
                studentId: newStudentId || undefined, // 新しいIDがあれば更新
                name: newName || undefined,           // 新しい名前があれば更新
            },
        });

        return NextResponse.json({
            message: "生徒情報が正常に更新されました",
            success: true,
            updatedStudent,
        });
    } catch {
        return NextResponse.json(
            { message: "サーバーエラーが発生しました", success: false },
            { status: 500 }
        );
    } finally {
        await prisma.$disconnect();
    }
}
