/* パスワードリセットフォームページ */

'use client';

import React, { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button, Input } from '@nextui-org/react';
import toast from 'react-hot-toast';

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const router = useRouter();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error('パスワードが一致しません');
      return;
    }
    if (!token) {
      toast.error('トークンが存在しません');
      return;
    }

    setIsLoading(true);
    const res = await fetch('/api/auth/resetPassword/admin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ token, password }),
    });
    const data = await res.json();
    if (res.ok) {
      toast.success('パスワードを更新しました');
      router.push('/');
    } else {
      toast.error(data.error || 'エラーが発生しました');
    }
    setIsLoading(false);
  };

  return (
    <div style={{ maxWidth: '400px', margin: '2rem auto', padding: '1rem' }}>
      <h2>パスワードリセット</h2>
      <form onSubmit={handleSubmit}>
        <Input
          type="password"
          label="新しいパスワード"
          placeholder="新しいパスワードを入力してください"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Input
          type="password"
          label="新しいパスワード（確認）"
          placeholder="再度パスワードを入力してください"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <Button
          type="submit"
          disabled={isLoading}
          fullWidth
        >
          {isLoading ? '更新中...' : 'パスワードを更新する'}
        </Button>
      </form>
    </div>
  );
}
