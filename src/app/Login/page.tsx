/* ログインページ */

'use client';

import { Card, Button, Image, useDisclosure } from "@nextui-org/react";
import { StudentLoginModal } from '../components/Modal/StudentLoginModal';
import { AdminLoginModal } from '../components/Modal/AdminLoginModal';
import { NextPage } from 'next';

const LoginPage: NextPage = () => {

    const { // 生徒用ログインモーダル開閉用状態変数
        isOpen: isStudentModalOpen,
        onOpen: onStudentModalOpen,
        onOpenChange: onStudentModalOpenChange,
    } = useDisclosure();

    const { // 管理者用ログインモーダル開閉用状態変数
        isOpen: isAdminModalOpen,
        onOpen: onAdminModalOpen,
        onOpenChange: onAdminModalOpenChange,
    } = useDisclosure();

    return (
        <>
            <div
                className="min-h-screen bg-cover bg-center flex items-center justify-center"
                style={{ backgroundImage: "url('/back.jpg')" }} // 背景画像を設定
            >
                <Card className="sm:m-4 lg:p-17 flex flex-col sm:flex-row bg-white bg-opacity-90 shadow-2xl max-w-screen-lg lg:max-w-screen-xl">
                    <div>
                        <Image
                            width={700} // lg サイズで画像が大きくなる
                            height={550}
                            radius="none"
                            alt="NextUI hero Image"
                            src="/EnglishSpeaking.png"
                            className="lg:w-[1000px] lg:h-[650px]"
                        />
                    </div>
                    <div className="w-full sm:w-1/2 flex flex-col items-center gap-6 lg:gap-10 mt-7 m-3">
                        <div className="text-center mb-6 lg:mb-8">
                            <strong className="text-xl sm:text-xl lg:text-xl">Welcome To</strong>
                        </div>
                        <Button
                            radius="md"
                            size="lg"
                            className="bg-gradient-to-tr from-lime-400 to-green-600 text-white shadow-lg w-full sm:w-auto lg:w-[70%] lg:text-xl lg:py-5"
                            onClick={onStudentModalOpen}
                        >
                            生徒用ログインはこちら
                        </Button>
                        <Button
                            radius="md"
                            size="lg"
                            className="bg-gradient-to-tr from-pink-500 to-yellow-500 text-white shadow-lg w-full lg:mb-3 sm:w-auto lg:w-[70%] lg:text-xl lg:py-5"
                            onClick={onAdminModalOpen}
                        >
                            管理者用ログインはこちら
                        </Button>
                        <StudentLoginModal showFlag={isStudentModalOpen} ChangeFlag={onStudentModalOpenChange} />
                        <AdminLoginModal showFlag={isAdminModalOpen} ChangeFlag={onAdminModalOpenChange} />
                    </div>
                </Card>
            </div>
        </>
    );
}

export default LoginPage;
