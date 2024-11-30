/* 管理者用ダッシュボードページ */

'use client';

import { NextPage } from 'next';
import { AdminNavigationbar } from '../components/Navbar/AdminNavbar';

const Admindashboard: NextPage = () => {
    
    return(
        <>
            <div className='bg-blue-100 min-h-screen'>
               <AdminNavigationbar/> 
            </div>
        </>
    );
} 

export default Admindashboard;