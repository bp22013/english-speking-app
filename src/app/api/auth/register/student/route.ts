/* 生徒新規登録API */

'use server';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/PrismaProvider';
import { cookies } from 'next/headers';
import bcrypt from 'bcrypt';
import { add } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';

export async function POST(request: NextRequest) {

    const strech = 10; //bcryptのhashストレッチ
    const cookie = cookies();

    try {
        // リクエストデータの解析
        const data = await request.json();
        const { studentId, name, password } = data;

        const token = (await cookie).get("admintoken")?.value;

        //トークンが存在しているか確認
        if (!token) {
            return NextResponse.json(
                { error: "変更権限がありません" },
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

        // パスワードのハッシュ化
        const hashedPassword = await bcrypt.hash(password, strech);

        //UTCを日本時間に変換
        const now = new Date();
        const japanTime = add(toZonedTime(now, 'Asia/Tokyo'), { hours: 9 });

        // データベースに新規生徒情報を作成
        const newStudent = await prisma.student.create({
            data: {
                studentId: studentId,
                name: name,
                hashedPassword: hashedPassword,
                createdAt: japanTime,
                updatedAt: new Date(),
            },
        });

        // すべての問題を取得
        const allQuestions = await prisma.question.findMany({
            select: { id: true },
        });

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

        return NextResponse.json(
            { message: "生徒が正常に登録され、AssignedQuestionに問題が分配されました", success: true, newStudent },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error creating student:", error);
        return NextResponse.json(
            { message: "サーバーエラーが発生しました", success: false },
            { status: 500 }
        );
    } finally {
        await prisma.$disconnect();
    }
}
