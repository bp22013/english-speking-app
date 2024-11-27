/* ログインページ */

'use client';

import { Card, Button, Image, useDisclosure } from "@nextui-org/react";
import { StudentLoginModal } from '../components/Modal/StudentLoginModal';
import { AdminLoginModal } from '../components/Modal/AdminLoginModal';
import { NextPage } from 'next';

const LoginPage:NextPage = () => {

    const { //生徒用ログインモーダル開閉用状態変数
        isOpen: isStudentModalOpen,
        onOpen: onStudentModalOpen,
        onOpenChange: onStudentModalOpenChange,
    } = useDisclosure();

    const { //管理者用ログインモーダル開閉用状態変数
        isOpen: isAdminModalOpen,
        onOpen: onAdminModalOpen,
        onOpenChange: onAdminModalOpenChange,
    } = useDisclosure();
  
    return (
        <>
            <Card className="m-20 mx-32 flex flex-col ">
                <div className="flex">
                    <div className="">
                        <Image
                            width={730}
                            height={600}
                            radius="none"
                            alt="NextUI hero Image"
                            src="/EnglishSpeaking.png"
                        />
                    </div>
                    <div className="m-5 mx-auto my-20 flex flex-col items-center">
                    <div className="mb-10"><strong>Welcome To</strong></div>
                        <Button
                            radius="md"
                            size="lg"
                            className="bg-gradient-to-tr from-lime-400 to-green-600 text-white shadow-lg mb-8"
                            onClick={onStudentModalOpen}
                        >
                            <div className="ml-2 m-2">
                                生徒用ログインはこちら
                            </div>
                        </Button>
                        <Button
                            radius="md"
                            size="lg"
                            className="bg-gradient-to-tr from-pink-500 to-yellow-500 text-white shadow-lg"
                            onClick={onAdminModalOpen}
                        >
                            管理者用ログインはこちら
                        </Button>
                        <StudentLoginModal showFlag={isStudentModalOpen} ChangeFlag={onStudentModalOpenChange} />
                        <AdminLoginModal showFlag={isAdminModalOpen} ChangeFlag={onAdminModalOpenChange} />
                    </div>
                </div>
            </Card>
        </>
    );
}

export default LoginPage;