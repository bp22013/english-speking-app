/* 生徒の成績確認ページ */

'use client';

import { NextPage } from 'next';
import { AdminNavigationbar } from '@/app/components/Navbar/AdminNavbar';

const AchievementPage: NextPage = () => {
    return (
        <>
            <div className="bg-blue-100 min-h-screen flex flex-col">
                <AdminNavigationbar/>
            </div>
        </>
    );
}

export default AchievementPage;