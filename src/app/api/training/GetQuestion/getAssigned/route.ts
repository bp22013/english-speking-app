'use server';

import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { studentId } = body;

        // 学生情報を取得
        const student = await prisma.student.findUnique({
            where: { studentId },
            select: { id: true },
        });

        if (!student) {
            return NextResponse.json({ error: "生徒が見つかりませんでした: " + studentId }, { status: 400 });
        }

        // 学生IDを取得
        const currentUserId = student.id;

        const assignedQuestions = await prisma.assignedQuestion.findMany({
            where: {
                studentId: currentUserId,
                isAnswered: false, // 未回答の問題のみ取得
            },
            include: {
                question: true, // 関連する問題の詳細を取得
            },
        });

        // `assignedQuestion` の構造から `question` の詳細を抽出
        const questions = assignedQuestions.map((aq) => ({
            id: aq.question.id,
            text: aq.question.text,
            correctAnswer: aq.question.correctAnswer,
        }));

        return NextResponse.json({ questions });
    } catch (error) {
        console.error("Error fetching questions:", error);
        return NextResponse.json({ error: 'サーバーエラーが発生しました' }, { status: 500 });
    }
}
