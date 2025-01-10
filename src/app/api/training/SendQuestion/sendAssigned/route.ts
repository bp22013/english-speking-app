/* 一般の問題を解くページの問題を送信するAPI */

'use server';

import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
    try {
        const { questionId, studentId, submittedAnswer, level } = await request.json();

        if (!questionId || !studentId || submittedAnswer === undefined || level === undefined) {
            return NextResponse.json(
                { error: "リクエストデータが不完全です" },
                { status: 400 }
            );
        }

        // studentId に基づいて学生のデータを取得
        const student = await prisma.student.findUnique({
            where: { studentId },
            select: { id: true },
        });

        if (!student) {
            return NextResponse.json(
                { message: "該当する学生が見つかりません" },
                { status: 404 }
            );
        }

        // 学生IDを取得
        const currentUserId = student.id;

        // 問題を取得
        const question = await prisma.question.findUnique({
            where: { id: questionId },
        });

        if (!question) {
            return NextResponse.json({ error: "問題が見つかりません" }, { status: 404 });
        }

        // 正解判定
        const isCorrect = question.correctAnswer === submittedAnswer;

        // 既存レコードの検索（複合キー条件）
        const existingAnswer = await prisma.answer.findFirst({
            where: {
                studentId: currentUserId,
                questionId: questionId,
            },
        });

        if (existingAnswer) {
            // 既存レコードがある場合は更新
            await prisma.answer.update({
                where: { id: existingAnswer.id },
                data: { submittedAnswer, isCorrect },
            });
        } else {
            // 既存レコードがない場合は新規作成
            await prisma.answer.create({
                data: {
                    studentId: currentUserId,
                    questionId,
                    submittedAnswer,
                    isCorrect,
                },
            });
        }

        const now = new Date(); //解答時刻を取得

        // 該当の AssignedQuestion を更新（isAnswered = true）
        await prisma.assignedQuestion.updateMany({
            where: {
                studentId: currentUserId,
                questionId: questionId,
            },
            data: {
                isAnswered: true,
                isCorrect: true,
                answeredAt: now,
            },
        });

        // 不正解の場合、IncorrectAssignedQuestion テーブルに登録
        if (!isCorrect) {
            await prisma.incorrectAssignedQuestion.upsert({
                where: {
                    studentId_questionId: {
                        studentId: currentUserId,
                        questionId: questionId,
                    },
                },
                update: {}, // 既存の場合は何もしない
                create: {
                    studentId: currentUserId,
                    questionId: questionId,
                    isAnswered: false,
                    isCorrect: null,
                },
            });
            await prisma.assignedQuestion.updateMany({
                where: {
                    studentId: currentUserId,
                    questionId: questionId,
                },
                data: {
                    isCorrect: false,
                }
            })
        }

        return NextResponse.json({
            message: isCorrect ? "正解です！" : "不正解です",
            correctAnswer: question.correctAnswer,
            flag: isCorrect ? true : false
        });
    } catch (error) {
        return NextResponse.json(
            { error: `サーバーエラーが発生しました。(${error})` },
            { status: 500 }
        );
    }
}
