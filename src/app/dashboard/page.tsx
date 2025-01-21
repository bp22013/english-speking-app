/* 生徒用ダッシュボードページ */

"use client";

import { NextPage } from "next";
import { StudentNavigationbar } from "../components/Navbar/StudentNavbar";
import { Image, Card, CardBody } from "@nextui-org/react";
import { StudentUseAuth } from "@/hooks/useAuth/StudentUseAuth";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const DashBoard: NextPage = () => {
    const loginuser = StudentUseAuth();
    const [unreadCount, setUnreadCount] = useState(0); // 新規通知数を管理する状態
    const [isLoading, setIsLoading] = useState(false);

    // 新規通知数を取得する関数
    const fetchUnreadCount = async () => {
        setIsLoading(true);

        try {
            const response = await fetch("/api/notification/GetNumberOfNewNotification/student", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    studentId: loginuser.studentId, // 生徒IDを送信
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setUnreadCount(data.unreadCount || 0); // 通知数を更新
            } else {
                toast.error(`サーバーエラーが発生しました（${data.error}）`);
            }
        } catch (error) {
            toast.error(`不明なエラーが発生しました（${error}）`);
        } finally {
            setIsLoading(false);
        }
    };

    // コンポーネントの初回マウント時に新規通知数を取得
        useEffect(() => {
            if (loginuser.studentId) {
                fetchUnreadCount();
            }
        }, [loginuser.studentId]);

    return (
        <div className="bg-blue-100 min-h-screen flex flex-col">
            <StudentNavigationbar />
            <div className="flex flex-col items-center justify-center my-10 space-y-6 w-full max-w-4xl mx-auto">
                <Image
                    width={900}
                    height={250}
                    radius="sm"
                    alt="Dashboard Hero Image"
                    src="/images.jpg"
                />

                <div className="flex w-full space-x-4">
                    <Card radius="sm" className="w-1/3">
                        <CardBody>
                            <div className="flex items-center space-x-4">
                                <Image
                                    alt="NextUI Logo"
                                    height={40}
                                    radius="full"
                                    src="https://avatars.githubusercontent.com/u/86160567?s=200&v=4"
                                    width={40}
                                />
                                <div className="text-xs">
                                    <strong>
                                        <p>こんにちは、{loginuser.username || null}さん</p>
                                        <p>良いペースですね。その調子で</p>
                                        <p>頑張りましょう！</p>
                                    </strong>
                                </div>
                            </div>
                        </CardBody>
                    </Card>
                    <Card radius="sm" className="w-1/3">
                        <CardBody>
                            <div className="flex my-auto ml-2">
                                <p>
                                    <strong>前回の学習日: {loginuser.updateAt}</strong>
                                </p>
                            </div>
                        </CardBody>
                    </Card>
                    <Card radius="sm" className="w-1/3">
                        <CardBody>
                            <div className="flex my-auto ml-2">
                                {isLoading ? (
                                    <p><strong>読み込み中...</strong></p>
                                ) : unreadCount === 0 ? ( 
                                    <p><strong>新しいお知らせはありません。</strong></p>
                                ) : (
                                    <p><strong>新しいお知らせが {unreadCount} 件あります！</strong></p>
                                )}
                            </div>
                        </CardBody>
                    </Card>
                </div>
                <div className="flex w-full space-x-4">
                    <Card radius="sm" className="w-1/2">
                        <CardBody>
                        </CardBody>
                    </Card>
                    <Card radius="sm" className="w-1/2">
                        <CardBody>

                        </CardBody>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default DashBoard;
