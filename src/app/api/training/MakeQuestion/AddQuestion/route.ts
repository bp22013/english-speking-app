/* 問題作成ページの問題情報を追加するAPI */

'use server';

import { NextResponse } from "next/server";
import { prisma } from "@/lib/PrismaProvider";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { text, correctAnswer, level, email } = body;

        // 入力チェック
        if (!text || !correctAnswer || level === undefined) {
            return NextResponse.json(
                { error: "問題文、正解、レベルは必須です。" },
                { status: 400 }
            );
        }

        const admin = await prisma.admin.findUnique({
            where: { email },
            select: { id: true },
        });

        if (!admin) {
            return NextResponse.json(
                { error: "作成権限がありません。" },
                { status: 403 }
            );
        }

        const adminId = admin.id;

        // 重複チェック: 問題文と正解の組み合わせが既存のデータに存在するか確認
        const existingQuestion = await prisma.question.findFirst({
            where: {
                text,
                correctAnswer,
            },
        });

        if (existingQuestion) {
            return NextResponse.json(
                { error: "同じ問題文と正解が既に存在します。" },
                { status: 400 }
            );
        }

        // 問題を作成
        const newQuestion = await prisma.question.create({
            data: {
                text,
                correctAnswer,
                level,
                adminId,
            },
        });

        // 全生徒に問題を割り当てる
        const students = await prisma.student.findMany({ select: { id: true } });

        const assignedQuestions = students.map((student) => ({
            studentId: student.id,
            questionId: newQuestion.id,
            isAnswered: false,
            isCorrect: null,
        }));

        await prisma.assignedQuestion.createMany({
            data: assignedQuestions,
        });

        return NextResponse.json({
            message: "正常に問題が作成されました。",
            question: newQuestion,
        });
    } catch (error) {
        console.error("Error creating question:", error);
        return NextResponse.json(
            { error: "サーバーエラーが発生しました。" },
            { status: 500 }
        );
    }
}
