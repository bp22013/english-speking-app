/* 生徒新規登録API */

'use server';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/PrismaProvider';
import { cookies } from 'next/headers';
import bcrypt from 'bcrypt';
import { add } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';

export async function POST(request: NextRequest) {
    const strech = parseInt(process.env.BCRYPT_STREACH || "", 10); // bcryptのhashストレッチ
    const cookie = cookies();

    try {
        // リクエストデータの解析
        const data = await request.json();
        const { studentId, name, password } = data;

        const token = (await cookie).get("admintoken")?.value;

        //トークンが存在しているか確認
        if (!token) {
            return NextResponse.json(
                { message: "変更権限がありません", success: false },
                { status: 401 }
            );
        }

        // 必須項目のチェック
        if (!studentId || !name || !password) {
            return NextResponse.json(
                { message: "すべてのフィールドを入力してください", success: false },
                { status: 400 }
            );
        }

        // 既存の生徒IDをチェック
        const existingStudent = await prisma.student.findUnique({
            where: { studentId: studentId }
        });

        if (existingStudent) {
            return NextResponse.json(
                { message: "この生徒IDは既に使用されています", success: false },
                { status: 400 }
            );
        }

        // パスワードのハッシュ化
        const hashedPassword = await bcrypt.hash(password, strech);

        //UTCを日本時間に変換
        const now = new Date();
        const japanTime = add(toZonedTime(now, 'Asia/Tokyo'), { hours: 9 });

        // データベースに新規生徒情報を作成
        const newStudent = await prisma.student.create({
            data: {
                studentId,
                name,
                hashedPassword,
                createdAt: japanTime,
                updatedAt: japanTime,
            },
        });

        // すべての問題を取得
        const allQuestions = await prisma.question.findMany({
            select: { id: true },
        });

        if (allQuestions.length > 0) {
            // 新規生徒にのみ `AssignedQuestion` を作成
            const assignedQuestions = allQuestions.map((question) => ({
                studentId: newStudent.id,
                questionId: question.id,
                isAnswered: false,
                isCorrect: null,
            }));

            await prisma.assignedQuestion.createMany({
                data: assignedQuestions,
            });
        }

        return NextResponse.json({
            message: "生徒の登録が完了しました",
            success: true,
            data: {
                studentId: newStudent.studentId,
                name: newStudent.name,
            }
        });

    } catch (error) {
        console.error("Error creating student:", error);
        return NextResponse.json({
            message: "生徒の登録中にエラーが発生しました",
            success: false,
            error: error instanceof Error ? error.message : "Unknown error"
        }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}