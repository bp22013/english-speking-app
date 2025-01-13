/* 管理者用ユーザー登録ページ */

'use client';

import { NextPage } from "next";
import { AdminNavigationbar } from "@/app/components/Navbar/AdminNavbar";
import { Button, useDisclosure } from "@nextui-org/react";
import { AdminPasswordCheckModal } from "@/app/components/Modal/AdminPasswordCheckModal";

const RegisterPage: NextPage = () => {
    // 生徒登録前確認モーダル開閉用状態変数
    const {
        isOpen: isStudentRegisterOpen,
        onOpen: onStudentRegisterOpen,
        onOpenChange: onStudentRegisterOpenChange,
    } = useDisclosure();

    // 管理者用登録前確認モーダル開閉用状態変数
    const {
        isOpen: isAdminRegisterOpen,
        onOpen: onAdminRegisterOpen,
        onOpenChange: onAdminRegisterOpenChange,
    } = useDisclosure();

    // 生徒削除前確認モーダル開閉用状態変数
    const {
        isOpen: isStudentDeleteOpen,
        onOpen: onStudentDeleteOpen,
        onOpenChange: onStudentDeleteOpenChange,
    } = useDisclosure();

    // 管理者用削除前確認モーダル開閉用状態変数
    const {
        isOpen: isAdminDeleteOpen,
        onOpen: onAdminDeleteOpen,
        onOpenChange: onAdminDeleteOpenChange,
    } = useDisclosure();

    const StudentRegisterUrl = "/Admindashboard/Register/StudentRegister";
    const AdminRegisterUrl = "/Admindashboard/Register/AdminRegister";
    const EditAdminUrl = "/Admindashboard/Register/EditAdmin";
    const EditStudentUrl = "/Admindashboard/Register/EditStudent";

    return (
        <>
            <div className="bg-blue-100 min-h-screen flex flex-col">
                <AdminNavigationbar />
                <div className="mt-10 flex flex-col items-center">
                    <div className="text-3xl md:text-5xl mb-12">
                        <strong>ユーザー管理</strong>
                    </div>
                    <div className="flex flex-row justify-center w-full gap-40">
                        <div className="flex flex-col items-center text-center">
                            <div className="text-2xl md:text-3xl mb-6">
                                <p><strong>新規登録</strong></p>
                            </div>
                            <div className="w-full flex flex-col space-y-6">
                                <Button
                                    className="w-full max-w-xs bg-gradient-to-tr from-lime-400 to-green-600 text-white shadow-lg text-lg md:text-2xl py-4 md:py-5"
                                    onClick={onStudentRegisterOpen}
                                >
                                    生徒の新規登録
                                </Button>
                                <Button
                                    className="w-full max-w-xs bg-gradient-to-tr from-lime-400 to-green-600 text-white shadow-lg text-lg md:text-2xl py-4 md:py-5"
                                    onClick={onAdminRegisterOpen}
                                >
                                    管理者の新規登録
                                </Button>
                            </div>
                        </div>
                        <div className="flex flex-col items-center text-center">
                            <div className="text-2xl md:text-3xl mb-6">
                                <p><strong>削除</strong></p>
                            </div>
                            <div className="w-full flex flex-col space-y-6">
                                <Button
                                    className="w-full max-w-xs bg-gradient-to-tr from-orange-300 to-red-600 text-white shadow-lg text-lg md:text-2xl py-4 md:py-5"
                                    onClick={onStudentDeleteOpen}
                                >
                                    生徒の削除
                                </Button>
                                <Button
                                    className="w-full max-w-xs bg-gradient-to-tr from-orange-300 to-red-600 text-white shadow-lg text-lg md:text-2xl py-4 md:py-5"
                                    onClick={onAdminDeleteOpen}
                                >
                                    管理者の削除
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <AdminPasswordCheckModal
                showFlag={isStudentRegisterOpen}
                ChangeFlag={onStudentRegisterOpenChange}
                apiUrl={StudentRegisterUrl}
            />
            <AdminPasswordCheckModal
                showFlag={isAdminRegisterOpen}
                ChangeFlag={onAdminRegisterOpenChange}
                apiUrl={AdminRegisterUrl}
            />
            <AdminPasswordCheckModal
                showFlag={isStudentDeleteOpen}
                ChangeFlag={onStudentDeleteOpenChange}
                apiUrl={EditStudentUrl}
            />
            <AdminPasswordCheckModal
                showFlag={isAdminDeleteOpen}
                ChangeFlag={onAdminDeleteOpenChange}
                apiUrl={EditAdminUrl}
            />
        </>
    );
};

export default RegisterPage;
