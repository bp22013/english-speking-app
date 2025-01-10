/* 生徒用の成績を参照するAPI */

"use server";

import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { studentId } = body;

        // 学生情報を取得
        const student = await prisma.student.findUnique({
            where: { studentId: studentId },
            select: { id: true },
        });
    
        if (!student) {
            return NextResponse.json(
                { error: "生徒が見つかりませんでした" },
                { status: 400 }
            );
        }

        // 課題のレベルを取得
        const assignedQuestions = await prisma.assignedQuestion.findMany({
            where: {
                studentId: student.id,
            },
            include: {
                question: {
                    select: {
                        level: true,
                    },
                },
            },
        });

        // レベルごとの統計を集計
        const levelStats = assignedQuestions.reduce((acc, q) => {
            const level = q.question.level;
            if (!acc[level]) {
                acc[level] = { null: 0, true: 0, false: 0 };
            }
          
            const status = q.isCorrect === null ? 'null' : 
                q.isCorrect === true ? 'true' : 'false';
            acc[level][status]++;
          
            return acc;
        }, {} as Record<number, { null: number; true: number; false: number; }>);

        // レベル順にソートしてグラフ用にデータを整形
        const formattedStats = Object.entries(levelStats)

        .sort(([levelA], [levelB]) => Number(levelA) - Number(levelB))
        .map(([level, stats]) => ({
            level: `レベル ${level}`,
            unanswered: stats.null,
            correct: stats.true,
            incorrect: stats.false,
        }));

        return NextResponse.json(formattedStats);
    } catch (error) {
        return NextResponse.json(
            { error: `サーバーエラーが発生しました。(${error})` },
            { status: 500 }
        );
    } finally {
        await prisma.$disconnect(); // データベースの切断
    }
}