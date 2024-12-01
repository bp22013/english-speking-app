import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
    try {
        const questions = await prisma.question.findMany({
            select: {
                id: true,
                text: true,
            },
        });

        return NextResponse.json({ questions });
    } catch {
        return NextResponse.json({ error: "問題の取得に失敗しました" }, { status: 500 });
    }
}
