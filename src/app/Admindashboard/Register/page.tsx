/* 管理者用ユーザー登録ページ */

'use client';

import { NextPage } from "next";
import { AdminNavigationbar } from "@/app/components/Navbar/AdminNavbar";
import { Button, useDisclosure } from "@nextui-org/react";
import { AdminPasswordCheckModal } from "@/app/components/Modal/AdminPasswordCheckModal";

const RegisterPage: NextPage = () => {
    // 生徒登録前確認モーダル開閉用状態変数
    const {
        isOpen: isStudentOpen,
        onOpen: onStudentOpen,
        onOpenChange: onStudentOpenChange,
    } = useDisclosure();

    // 管理者用登録前確認モーダル開閉用状態変数
    const {
        isOpen: isAdminOpen,
        onOpen: onAdminOpen,
        onOpenChange: onAdminOpenChange,
    } = useDisclosure();

    const StudentRegisterUrl = "/Admindashboard/Register/StudentRegister";
    const AdminRegisterUrl = "/Admindashboard/Register/AdminRegister";

    return (
        <>
            <div className="bg-blue-100 min-h-screen flex flex-col">
                <AdminNavigationbar />
                <div className="mt-10 flex flex-col items-center text-center">
                    <div className="text-2xl md:text-4xl">
                        <p>
                            <strong>ユーザーの新規登録</strong>
                        </p>
                    </div>
                    <div className="mt-10 w-full px-4 flex flex-col space-y-6">
                        <div className="w-full flex justify-center">
                            <Button
                                className="w-full max-w-xs bg-gradient-to-tr from-lime-400 to-green-600 text-white shadow-lg text-sm md:text-xl py-3 md:py-4"
                                onClick={onStudentOpen}
                            >
                                生徒の新規登録はこちら
                            </Button>
                        </div>
                        <div className="w-full flex justify-center">
                            <Button
                                className="w-full max-w-xs bg-gradient-to-tr from-lime-400 to-green-600 text-white shadow-lg text-sm md:text-xl py-3 md:py-4"
                                onClick={onAdminOpen}
                            >
                                管理者の新規登録はこちら
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
            <AdminPasswordCheckModal
                showFlag={isStudentOpen}
                ChangeFlag={onStudentOpenChange}
                apiUrl={StudentRegisterUrl}
            />
            <AdminPasswordCheckModal
                showFlag={isAdminOpen}
                ChangeFlag={onAdminOpenChange}
                apiUrl={AdminRegisterUrl}
            />
        </>
    );
};

export default RegisterPage;
