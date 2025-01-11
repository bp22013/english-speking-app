/* 管理者用設定ページ */

'use client';

import { NextPage } from "next";
import { AdminNavigationbar } from "@/app/components/Navbar/AdminNavbar";
import { Button, useDisclosure } from "@nextui-org/react";
import { useRouter } from 'next/navigation'
import { AdminPasswordCheckModal } from "@/app/components/Modal/AdminPasswordCheckModal";

const SettingPage: NextPage = () => {

    const ChangeEmailUrl = "/Admindashboard/setting/ChangeEmail";
    const ChangePasswordUrl = "/Admindashboard/setting/ChangePassword"

    const router = useRouter();

    const { //管理者用メールアドレス変更前確認モーダル開閉用状態変数
        isOpen: isEmailOpen,
        onOpen: onEmailOpen,
        onOpenChange: onEmailOpenChange,
    } = useDisclosure();

    const { //管理者用パスワード変更前確認モーダル開閉用状態変数
        isOpen: isPasswordOpen,
        onOpen: onPasswordOpen,
        onOpenChange: onPasswordOpenChange,
    } = useDisclosure();

    const PushNameChange = () => {
        router.push("/Admindashboard/setting/ChangeName");
    }

    return (
        <>
            <div className="bg-blue-100 min-h-screen flex flex-col">
                <AdminNavigationbar />
                <div className="mt-10 flex flex-col items-center text-center">
                    <div className="text-2xl md:text-4xl">
                        <p>
                            <strong>設定</strong>
                        </p>
                    </div>
                    <div className="mt-10 w-full px-4 flex flex-col space-y-6">
                        <div className="w-full flex justify-center">
                            <Button
                                className="w-full max-w-xs bg-gradient-to-tr from-lime-400 to-green-600 text-white shadow-lg text-sm md:text-xl py-3 md:py-4"
                                onClick={PushNameChange}
                            >
                                名前の変更はこちら
                            </Button>
                        </div>
                        <div className="w-full flex justify-center">
                            <Button
                                className="w-full max-w-xs bg-gradient-to-tr from-lime-400 to-green-600 text-white shadow-lg text-sm md:text-xl py-3 md:py-4"
                                onClick={onEmailOpen}
                            >
                                メールアドレスの変更はこちら
                            </Button>
                        </div>
                        <div className="w-full flex justify-center">
                            <Button
                                className="w-full max-w-xs bg-gradient-to-tr from-lime-400 to-green-600 text-white shadow-lg text-sm md:text-xl py-3 md:py-4"
                                onClick={onPasswordOpen}
                            >
                                パスワードの変更はこちら
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
            <AdminPasswordCheckModal showFlag={isEmailOpen} ChangeFlag={onEmailOpenChange} apiUrl={ChangeEmailUrl}/>
            <AdminPasswordCheckModal showFlag={isPasswordOpen} ChangeFlag={onPasswordOpenChange} apiUrl={ChangePasswordUrl}/>
        </>
    );
};

export default SettingPage;
