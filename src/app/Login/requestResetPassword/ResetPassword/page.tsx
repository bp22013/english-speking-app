/* パスワードリセットフォームページ */

'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input, Button } from '@nextui-org/react';
import toast from 'react-hot-toast';

export default function RequestResetPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email) {
      toast.error('メールアドレスを入力してください');
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/requestResetPassword', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(data.message || 'パスワードリセット用メールを送信しました');
        // 送信後、ログインページへ戻すなどの処理も可能
        router.push('/');
      } else {
        toast.error(data.error || 'エラーが発生しました');
      }
    } catch {
      toast.error('エラーが発生しました。もう一度お試しください。');
    }
    setIsLoading(false);
  };

  return (
    <div style={{ maxWidth: '400px', margin: '2rem auto', padding: '1rem' }}>
      <h2>パスワードリセットリクエスト</h2>
      <form onSubmit={handleSubmit}>
        <Input
          type="email"
          label="メールアドレス"
          placeholder="メールアドレスを入力してください"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Button type="submit" disabled={isLoading} style={{ marginTop: '1rem' }} fullWidth>
          {isLoading ? '送信中...' : 'リセットメールを送信'}
        </Button>
      </form>
    </div>
  );
}
