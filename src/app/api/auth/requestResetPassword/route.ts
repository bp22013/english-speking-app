// app/api/auth/request-reset-password/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/PrismaProvider';
import { SignJWT } from 'jose';
import { Resend } from 'resend';

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // 管理者（Admin）をメールで検索
    const admin = await prisma.admin.findUnique({ where: { email } });
    if (!admin) {
      return NextResponse.json({ error: 'Admin not found' }, { status: 404 });
    }

    // JWTトークンを生成（payload に adminId を含め、1時間有効とする）
    const token = await new SignJWT({ adminId: admin.id })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('1h')
      .sign(secret);

    // パスワードリセットURLを作成
    const resetUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/resetPassword?token=${token}`;

    // Resend ライブラリを利用してメール送信
    const resend = new Resend(process.env.NEXT_PUBLIC_EMAIL_PROVIDER_KEY);
    const emailResponse = await resend.emails.send({
      from: 'Your App <no-reply@yourapp.com>',
      to: email,
      subject: 'パスワードリセットのご案内',
      html: `<p>パスワードリセットをリクエストしました。<br>
             下記のリンクをクリックして新しいパスワードを設定してください。<br>
             <a href="${resetUrl}">${resetUrl}</a></p>`,
    });

    if (!emailResponse) {
      return NextResponse.json(
        { error: 'メール送信に失敗しました' },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: 'パスワードリセット用メールを送信しました' });
  } catch {
    return NextResponse.json(
      { error: '予期せぬエラーが発生しました' },
      { status: 500 }
    );
  }
}
