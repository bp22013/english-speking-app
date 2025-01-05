/* パスワードリセットフォームページ */

'use client';

import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const ResetPassword = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const resetPassword = async () => {
        const token = new URLSearchParams(window.location.search).get('token');
        if (!token) {
            toast.error('トークンが無効です');
            return;
        }

        if (password !== confirmPassword) {
            toast.error('パスワードが一致しません');
            return;
        }

        setIsLoading(true);

        try {
            // 独自のAPIエンドポイントでパスワード更新
            await axios.post('/api/auth/resetPassword', { token, password });
            toast.success('パスワードをリセットしました');
        } catch (error) {
            toast.error('エラーが発生しました。もう一度やり直してください');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <h1>パスワードを変更</h1>
            <input
                type="password"
                placeholder="新規パスワード"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <input
                type="password"
                placeholder="確認用新規パスワード"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <button onClick={resetPassword} disabled={isLoading}>
                {isLoading ? '処理中...' : '変更'}
            </button>
        </div>
    );
};

export default ResetPassword;
