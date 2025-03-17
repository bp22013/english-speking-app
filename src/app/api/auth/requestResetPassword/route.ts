// app/api/auth/request-reset-password/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/PrismaProvider';
import { SignJWT } from 'jose';
import nodemailer from 'nodemailer';

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
      .setExpirationTime('10m')
      .sign(secret);

    // パスワードリセットURLを作成
    const resetUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/Login/requestResetPassword?token=${token}`;

    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        auth: {
            user: process.env.GMAILUSER,
            pass: process.env.GMAILPASSWORD,
        },
    });

    const toHostMailData = {
        from: "masakiaokipiano@gmail.com",
        to: email,
        subject: `パスワードリセットのご案内`, // タイトル
        text: `パスワードリセットのご案内`,
        html: `<p>パスワードリセットをリクエストしました。<br>
             下記のリンクをクリックして新しいパスワードを設定してください。<br>
             <a href="${resetUrl}">${resetUrl}</a></p>`,
    };

    transporter.sendMail(toHostMailData, function (err: unknown, info: unknown) {
        if (err) console.log(err);
        else console.log(info);
    });

    return NextResponse.json({ message: 'パスワードリセット用メールを送信しました' });
  } catch {
    return NextResponse.json(
      { error: '予期せぬエラーが発生しました' },
      { status: 500 }
    );
  }
}
