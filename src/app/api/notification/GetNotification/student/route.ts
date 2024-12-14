/* 通知取得用API */

'use server';

import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { cookies } from "next/headers";

const prisma = new PrismaClient();

export async function POST(request: Request) {
    try {
        const { studentId, page = 1, limit = 5 } = await request.json(); // ページと件数を受け取る

        // 生徒IDが無い場合
        if (!studentId) {
            return NextResponse.json(
                { error: "生徒IDが必要です" },
                { status: 400 }
            );
        }

        const cookie = cookies();
        const token = (await cookie).get("studenttoken");

        // JWTトークンが無い場合
        if (!token) {
            return NextResponse.json(
                { message: "権限がありません" },
                { status: 403 }
            );
        }

        // 生徒のレコードを取得
        const studentRecord = await prisma.student.findUnique({
            where: {
                studentId: studentId,
            },
            select: {
                id: true,
            },
        });

        // IDが無い場合
        if (!studentRecord) {
            return NextResponse.json(
                { error: "生徒が見つかりませんでした" },
                { status: 404 }
            );
        }

        // 通知を取得
        const skip = (page - 1) * limit; // スキップする件数
        const notifications = await prisma.notification.findMany({
            where: {
                studentId: studentRecord.id,
            },
            orderBy: {
                createdAt: "desc",
            },
            skip: skip,
            take: limit,
        });

        // 通知の総数を取得
        const totalNotifications = await prisma.notification.count({
            where: {
                studentId: studentRecord.id,
            },
        });

        // ページ総数を計算
        const totalPages = Math.ceil(totalNotifications / limit);

        return NextResponse.json({
            notifications,
            totalPages,
            currentPage: page,
        });
    } catch (error) {
        console.error("Error fetching notifications:", error);
        return NextResponse.json(
            { error: "サーバーエラーが発生しました" },
            { status: 500 }
        );
    }
}
