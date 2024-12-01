/* 生徒用ダッシュボードページ */

'use client';

import { NextPage } from 'next';
import { StudentNavigationbar } from '../components/Navbar/StudentNavbar';
import { Image, Card, CardBody } from '@nextui-org/react';
import React from 'react';
import { StudentUseAuth } from '@/hooks/useAuth/StudentUseAuth';

const DashBoard: NextPage = () => {

    const loginuser = StudentUseAuth();

    const formattedDate = 
        (loginuser.updateAt_year && loginuser.updateAt_month && loginuser.updateAt_day)
        ? `　${loginuser.updateAt_year} / ${loginuser.updateAt_month} / ${loginuser.updateAt_day}`
        : "";

    return (
        <>
            <div className='bg-blue-100 min-h-screen'>
                <StudentNavigationbar />
                <div className="flex flex-col items-center justify-center mt-10 space-y-6 w-full max-w-3xl mx-auto">
                    <Image
                        width={900}
                        height={250}
                        radius="sm"
                        alt="NextUI hero Image"
                        src="/images.jpg"
                    />

                    <div className="flex w-full space-x-4">
                        <Card radius="sm" className="w-1/2">
                            <CardBody>
                                <div className="flex items-center space-x-4">
                                    <Image
                                        alt="nextui logo"
                                        height={40}
                                        radius="full"
                                        src="https://avatars.githubusercontent.com/u/86160567?s=200&v=4"
                                        width={40}
                                    />
                                    <div className="text-xs">
                                        <strong>
                                            <p>こんにちは、{loginuser.username ?? "ゲスト"}さん</p>
                                            <p>良いペースですね。その調子で</p>
                                            <p>頑張りましょう！</p>
                                        </strong>
                                    </div>
                                </div>
                            </CardBody>
                        </Card>
                        <Card radius="sm" className="w-1/2">
                            <CardBody>
                                <div className='flex my-auto ml-2'>
                                    <p><strong>前回の学習日 : {formattedDate}</strong></p>
                                </div>
                            </CardBody>
                        </Card>
                    </div>
                </div>
            </div>
        </>
    );
};

export default DashBoard;
