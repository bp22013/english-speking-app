/* 一般の問題を解くページの問題を取得するAPI */

'use server';

import { prisma } from "@/lib/PrismaProvider";
import { NextResponse } from 'next/server';

// 配列をシャッフルする関数
const shuffleArray = <T>(array: T[]): T[] => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
};

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { studentId, level } = body;

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

        // 該当レベルの AssignedQuestion が全て回答済みかをチェック
        const remainingQuestionsInLevel = await prisma.assignedQuestion.findMany({
            where: {
                studentId: currentUserId,
                isAnswered: false,
                question: {
                    level: level,
                },
            },
        });

        if (remainingQuestionsInLevel.length === 0) {
            // 該当レベルの全ての問題が回答済みの場合、該当レベルの isAnswered と isCorrectをリセット
            await prisma.assignedQuestion.updateMany({
                where: {
                    studentId: currentUserId,
                    question: {
                        level: level,
                    },
                },
                data: { 
                    isAnswered: false,
                    isCorrect: null,
                    answeredAt: null,
                },
            });
        }

        const assignedQuestions = await prisma.assignedQuestion.findMany({
            where: {
                studentId: currentUserId,
                isAnswered: false, // 未回答の問題のみ取得
                question: {
                    level: level, // 指定されたレベルの問題のみ取得
                },
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

        // 配列をランダムにシャッフル
        const shuffledQuestions = shuffleArray(questions);

        return NextResponse.json({ questions: shuffledQuestions });
    } catch (error) {
        console.error("Error fetching questions:", error);
        return NextResponse.json({ error: 'サーバーエラーが発生しました' }, { status: 500 });
    }
}
