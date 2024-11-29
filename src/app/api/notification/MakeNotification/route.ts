'use server';

import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: Request) {
    const { message } = await request.json();

    if (!message) {
        return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    // 全生徒に通知を送信
    const students = await prisma.student.findMany();

    await prisma.notification.createMany({
        data: students.map((student) => ({
            message,
            studentId: student.id,
            createdAt: new Date(),
        })),
    });

    return NextResponse.json({ message: "Notifications created for all students" });
}
