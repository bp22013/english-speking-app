import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { cookies } from "next/headers";

const prisma = new PrismaClient();

export async function POST(request: Request) {

    const { CurrentstudentId } = await request.json();
    const cookie = cookies();
    const token = (await cookie).get("studenttoken");
    if(!token) {
        return NextResponse.json({message:"権限がありません"});
    }

    const notifications = await prisma.notification.findMany({
        where: {
            studentId: CurrentstudentId,
        },
        orderBy: {
            createdAt: "desc",
        },
    });

    return NextResponse.json(notifications);
}
