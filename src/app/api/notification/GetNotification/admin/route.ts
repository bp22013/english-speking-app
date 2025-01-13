/* 通知取得用API */

'use server';

import { NextResponse } from "next/server";
import { prisma } from "@/lib/PrismaProvider";
import { cookies } from "next/headers";

export async function POST(request: Request) {
    try {
        const { email, page = 1, limit = 5 } = await request.json(); // ページと件数を受け取る

        // 生徒IDが無い場合
        if (!email) {
            return NextResponse.json(
                { error: "管理者権限が必要です" },
                { status: 400 }
            );
        }

        const cookie = cookies();
        const token = (await cookie).get("admintoken");

        // JWTトークンが無い場合
        if (!token) {
            return NextResponse.json(
                { message: "権限がありません" },
                { status: 403 }
            );
        }

        // 管理者のレコードを取得
        const adminRecord = await prisma.admin.findUnique({
            where: {
                email: email,
            },
            select: {
                id: true,
            },
        });

        // IDが無い場合
        if (!adminRecord) {
            return NextResponse.json(
                { error: "管理者が見つかりませんでした" },
                { status: 404 }
            );
        }

        // 通知を取得
        const skip = (page - 1) * limit; // スキップする件数

        const notifications = await prisma.notification.findMany({
            where: {
                adminId: adminRecord.id,
            },
            orderBy: {
                createdAt: "desc",
            },
            skip: skip,
            take: limit * 2, // 必要な件数より多めに取得
        });

        // 重複を排除
        const uniqueNotifications = Array.from(
            new Map(notifications.map(item => [item.message, item])).values()
        ).slice(0, limit); // メッセージをキーにして重複排除後、ページの件数分だけ取得

        // 通知の総数を取得
        const totalNotifications = await prisma.notification.findMany({
            where: {
                adminId: adminRecord.id,
            },
        });

        const uniqueTotalNotifications = Array.from(
            new Map(totalNotifications.map(item => [item.message, item])).values()
        ).length; // 重複を排除した件数を計算

        // ページ総数を計算
        const totalPages = Math.ceil(uniqueTotalNotifications / limit);

        return NextResponse.json({
            notifications: uniqueNotifications,
            totalPages,
            currentPage: page,
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "サーバーエラーが発生しました" },
            { status: 500 }
        );
    }
}
