import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: Request) {
    try {
        const { answers, studentId } = await request.json();

        // `answers`の形式: { [questionId: number]: string }
        const data = Object.entries(answers).map(([questionId, submittedAnswer]) => ({
            questionId: parseInt(questionId, 10),
            submittedAnswer,
            studentId: studentId, // 実際のログイン生徒IDを取得
            isCorrect: false, // 必要に応じて判定ロジックを追加
        }));

        await prisma.answer.createMany({ data });

        return NextResponse.json({ message: "回答が保存されました" });
    } catch {
        return NextResponse.json({ error: "回答の保存に失敗しました" }, { status: 500 });
    }
}
