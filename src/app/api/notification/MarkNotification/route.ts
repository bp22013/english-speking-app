"use server";

import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    // リクエストボディからデータを取得
    const body = await request.json();
    const { notificationId, studentId } = body;

    // バリデーション: 必要なデータが存在するか
    if (!notificationId || !studentId) {
      return NextResponse.json(
        { error: "Notification ID and Student ID are required" },
        { status: 400 }
      );
    }

    // 通知が存在し、指定された生徒IDに関連付けられているか確認
    const notification = await prisma.notification.findFirst({
      where: {
        id: numericNotificationId,
        studentId, // 生徒IDでフィルタリング
      },
    });

    // 該当する通知が見つからない場合
    if (!notification) {
      return NextResponse.json(
        { error: "Notification not found for the given student ID" },
        { status: 404 }
      );
    }

    // 通知を既読に更新
    await prisma.notification.update({
      where: { id: numericNotificationId },
      data: { isRead: true },
    });

    return NextResponse.json({ message: "Notification marked as read" });
  } catch (error) {
    console.error("Error updating notification:", error);
    return NextResponse.json(
      { error: "Failed to update notification" },
      { status: 500 }
    );
  }
}
