/* 管理者用ダッシュボードページ */

'use client';

import { NextPage } from 'next';
import { AdminNavigationbar } from '../components/Navbar/AdminNavbar';
import { Image, Card, CardBody } from '@nextui-org/react';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

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