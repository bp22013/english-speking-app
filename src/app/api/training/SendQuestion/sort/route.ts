/* 仕分けページ採点＆保存用API */

'use server';

import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { questionId, submittedAnswer, studentId } = await request.json();

    // 正解を取得
    const question = await prisma.question.findUnique({
      where: { id: questionId },
      select: { correctAnswer: true },
    });

    if (!question) {
      return NextResponse.json({ error: "問題が見つかりませんでした:" }, { status: 404 });
    }

    // 採点
    const isCorrect = question.correctAnswer === submittedAnswer;

    // studentId に基づいて学生のデータを取得
    const student = await prisma.student.findUnique({
      where: { studentId },
      select: { id: true },
    });

    if (!student) {
      return NextResponse.json({ error: "生徒が見つかりませんでした:" + studentId }, { status: 404 });
    }

    // 学生IDを取得
    const currentUserId = student.id;

    // 回答を保存
    await prisma.answer.create({
      data: {
        questionId,
        submittedAnswer,
        studentId: currentUserId,
        isCorrect,
      },
    });

    return NextResponse.json({
      message: isCorrect ? "正解です！" : "不正解です。",
      isCorrect,
    });
  } catch (error) {
    console.error("エラー発生:", error);
    return NextResponse.json({ error: "採点処理に失敗しました" }, { status: 500 });
  }
}
