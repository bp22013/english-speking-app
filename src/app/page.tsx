/* デフォルトページ */

'use client';

import { NextPage } from 'next';
import LoginPage from './Login/page'

const DefaultPage: NextPage = () => {
    return (
        <LoginPage />
    );
}

export default DefaultPage;