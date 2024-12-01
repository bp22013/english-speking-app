/* 仕分けページの問題を取得するAPI */

'use server';

import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
    try {
        // ランダムな問題IDを10個生成
        const randomIds: number[] = [];
        while (randomIds.length < 10) {
            const randomId = Math.floor(Math.random() * 20) + 1; // 1〜20のランダムな整数
            if (!randomIds.includes(randomId)) {
                randomIds.push(randomId); // 重複しない場合のみ追加
            }
        }

        // 問題を取得
        const questions = await prisma.question.findMany({
            where: {
                id: {
                    in: randomIds, // 生成したランダムなIDを使用
                },
            },
        });

        // シャッフルして返す
        const shuffledQuestions = questions.sort(() => 0.5 - Math.random());

        return NextResponse.json({ questions: shuffledQuestions });
    } catch {
        return NextResponse.json({ error: "問題の取得に失敗しました" }, { status: 500 });
    }
}
