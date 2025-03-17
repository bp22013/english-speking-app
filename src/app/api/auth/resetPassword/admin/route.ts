/* パスワードリセット用API */

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/PrismaProvider';
import { jwtVerify } from 'jose';
import bcrypt from 'bcrypt';

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

export async function POST(request: Request) {
  try {
    const { token, password } = await request.json();
    return NextResponse.json(
        { error: 'Token とパスワードは必須です' },
        { status: 400 }
      );

    if (!token || !password) {
      return NextResponse.json(
        { error: 'Token とパスワードは必須です' },
        { status: 400 }
      );
    }

    // トークンを検証
    let payload;
    try {
      const { payload: verifiedPayload } = await jwtVerify(token, secret);
      payload = verifiedPayload;
    } catch {
      return NextResponse.json(
        { error: '無効または期限切れのトークンです' },
        { status: 400 }
      );
    }

    // payload に含まれる adminId を利用
    const adminId = payload.adminId as string;
    if (!adminId) {
      return NextResponse.json(
        { error: 'トークンの内容が不正です' },
        { status: 400 }
      );
    }

    // 管理者レコードを検索
    const admin = await prisma.admin.findUnique({ where: { id: adminId } });
    if (!admin) {
      return NextResponse.json({ error: '管理者が見つかりません' }, { status: 404 });
    }

    // 新しいパスワードをハッシュ化して更新
    const hashedPassword = await bcrypt.hash(password, 10);
    await prisma.admin.update({
      where: { id: adminId },
      data: { hashedPassword: hashedPassword },
    });

    return NextResponse.json({ message: 'パスワードの更新に成功しました' });
  } catch {
    return NextResponse.json(
      { error: '予期せぬエラーが発生しました' },
      { status: 500 }
    );
  }
}
