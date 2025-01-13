/* 管理者用ダッシュボードページ */

'use client';

import { NextPage } from 'next';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AdminNavigationbar } from '../components/Navbar/AdminNavbar';
import { AdminUseAuth } from '@/hooks/useAuth/AdminUseAuth';
import { Card, CardBody, CardHeader, Spacer } from '@nextui-org/react';
import { Users, BookOpen, Bell, Wrench, Pencil } from 'lucide-react';
import toast from 'react-hot-toast';

const Admindashboard: NextPage = () => {
    const router = useRouter();
    const loginuser = AdminUseAuth();
    const [numberOfQuestions, setNumberOfQuestions] = useState(null);
    const [numberOfNotifications, setNumberOfNotifications] = useState(null);
    const [numberOfStudent, setNumberOfStudent] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    // 問題作成ページへ遷移する関数
    const PushMakeQuestion = () => {
        router.push("/Admindashboard/MakeQuestion");
    };

    // 生徒の成績閲覧ページへ遷移する関数
    const PushAchievementPage = () => {
        router.push("/Admindashboard/Achievement");
    };

    // 通知を作成するページへ遷移する関数
    const PushNotificationPage = () => {
        router.push("/Admindashboard/Notification");
    };

    // ユーザーを登録するページへ遷移する関数
    const PushRegisterPage = () => {
        router.push("/Admindashboard/Register");
    };

    // 設定ページへ遷移する関数
    const PushSettingPage = () => {
        router.push("/Admindashboard/setting");
    };

    // 情報を取得する関数
    const fetchInfomation = async () => {
        setIsLoading(true);

        try {
            const response = await fetch("/api/console", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email: loginuser.email }),
            });

            const data = await response.json();

            if (data.success) {
                setNumberOfQuestions(data.NumberOfQuestions);
                setNumberOfNotifications(data.NumberOfNotifications);
                setNumberOfStudent(data.NumberOfStudent);
            } else {
                toast.error(data.message);
            }
        } catch {
            toast.error("不明なエラーが発生しました");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (loginuser.email) {
            fetchInfomation();
        }
    }, [loginuser.email]);

    return (
        <>
            <div className="bg-blue-100 min-h-screen flex flex-col">
                <AdminNavigationbar />
                {isLoading ? (<></>) : (
                    <main className="flex flex-col my-10 space-y-8 w-full max-w-5xl mx-auto">
                        <div className='mx-auto my-3 text-4xl'>
                            <h1><strong>管理コンソール</strong></h1>
                        </div>
                        <div className="flex w-full gap-10">
                            <Card radius="sm" className="w-1/2" isPressable onPress={PushMakeQuestion}>
                                <CardHeader>
                                    <div className="text-left">
                                        <h1 className="text-2xl">
                                            <strong>問題作成</strong>
                                        </h1>
                                        <p className="text-sm text-gray-500">
                                            問題の作成と編集
                                        </p>
                                    </div>
                                </CardHeader>
                                <CardBody>
                                    <div className="flex items-center space-x-4">
                                        <BookOpen className="h-8 w-8 text-primary" />
                                        <div>
                                            <p className="text-2xl font-bold">{isLoading ? ("-") : (`${numberOfQuestions}問`)}</p>
                                            <p className="text-sm text-[#696969] text-muted-foreground">総問題数</p>
                                        </div>
                                    </div>
                                </CardBody>
                            </Card>
                            <Card radius="sm" className="w-1/2" isPressable onPress={PushAchievementPage}>
                                <CardHeader>
                                    <div className="text-left">
                                        <h1 className="text-2xl">
                                            <strong>生徒の成績</strong>
                                        </h1>
                                        <p className="text-sm text-gray-500">
                                            成績の閲覧
                                        </p>
                                    </div>
                                </CardHeader>
                                <CardBody>
                                    <div className="flex items-center space-x-4">
                                        <Pencil className="h-8 w-8 text-primary" />
                                        <div>
                                            <p className="text-2xl font-bold">{"-"}</p>
                                            <p className="text-sm text-[#696969] text-muted-foreground">総生徒数</p>
                                        </div>
                                    </div>
                                </CardBody>
                            </Card>
                        </div>
                        <Spacer />
                        <div className="flex w-full gap-10">
                            <Card radius="sm" className="w-1/2" isPressable onPress={PushRegisterPage}>
                                <CardHeader>
                                    <div className="text-left">
                                        <h1 className="text-2xl">
                                            <strong>ユーザー登録</strong>
                                        </h1>
                                        <p className="text-sm text-gray-500">
                                            生徒の新規登録と管理
                                        </p>
                                    </div>
                                </CardHeader>
                                <CardBody>
                                    <div className="flex items-center space-x-4">
                                        <Users className="h-8 w-8 text-primary" />
                                        <div>
                                            <p className="text-2xl font-bold">{isLoading ? ("-") : (`${numberOfStudent}人`)}</p>
                                            <p className="text-sm text-[#696969] text-muted-foreground">総生徒数</p>
                                        </div>
                                    </div>
                                </CardBody>
                            </Card>
                            <Card radius="sm" className="w-1/2" isPressable onPress={PushNotificationPage}>
                                <CardHeader>
                                    <div className="text-left">
                                        <h1 className="text-2xl">
                                            <strong>お知らせ作成</strong>
                                        </h1>
                                        <p className="text-sm text-gray-500">
                                            お知らせの作成と編集
                                        </p>
                                    </div>
                                </CardHeader>
                                <CardBody>
                                    <div className="flex items-center space-x-4">
                                        <Bell className="h-8 w-8 text-primary" />
                                        <div>
                                            <p className="text-2xl font-bold">{isLoading ? ("-") : (`${numberOfNotifications}件`)}</p>
                                            <p className="text-sm text-[#696969] text-muted-foreground">総お知らせ件数</p>
                                        </div>
                                    </div>
                                </CardBody>
                            </Card>
                        </div>
                        <Spacer />
                        <div className="flex w-full gap-10">
                            <Card radius="sm" className="w-1/2" isPressable onPress={PushSettingPage}>
                                <CardHeader>
                                    <div className="text-left">
                                        <h1 className="text-2xl">
                                            <strong>設定</strong>
                                        </h1>
                                        <p className="text-sm text-gray-500">
                                            メールアドレスや名前、パスワードの編集
                                        </p>
                                    </div>
                                </CardHeader>
                                <CardBody>
                                    <div className="flex items-center space-x-4">
                                        <Wrench className="h-8 w-8 text-primary" />
                                        <div>
                                            <p className="text-2xl font-bold">{isLoading ? ("-") : (loginuser.username)}</p>
                                            <p className="text-sm text-[#696969] text-muted-foreground">現在の名前</p>
                                        </div>
                                    </div>
                                </CardBody>
                            </Card>
                            <Card radius="sm" className="w-1/2">
                                <CardBody></CardBody>
                            </Card>
                        </div>
                    </main>
                )}
            </div>
        </>
    );
};

export default Admindashboard;
