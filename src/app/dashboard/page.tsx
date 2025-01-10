/* 生徒用ダッシュボードページ */

"use client";

import { NextPage } from "next";
import { StudentNavigationbar } from "../components/Navbar/StudentNavbar";
import { Image, Card, CardBody, CardHeader, Divider } from "@nextui-org/react";
import { AssignedQuestionsStats } from './AchievementReferenceSheet'
import { StudentUseAuth } from "@/hooks/useAuth/StudentUseAuth";

const DashBoard: NextPage = () => {
    const loginuser = StudentUseAuth();

    return (
        <div className="bg-blue-100 min-h-screen flex flex-col">
            <StudentNavigationbar />
            <div className="flex flex-col items-center justify-center mt-10 space-y-6 w-full max-w-4xl mx-auto">
                <Image
                    width={900}
                    height={250}
                    radius="sm"
                    alt="Dashboard Hero Image"
                    src="/images.jpg"
                />

                <div className="flex w-full space-x-4">
                    <Card radius="sm" className="w-1/2">
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
                    <Card radius="sm" className="w-1/2">
                        <CardBody>
                            <div className="flex my-auto ml-2">
                                <p>
                                    <strong>前回の学習日: {loginuser.updateAt}</strong>
                                </p>
                            </div>
                        </CardBody>
                    </Card>
                </div>

                <Card className="w-full">
                    <CardHeader className="text-xl justify-center">
                        <strong>トレーニングの成績</strong>
                    </CardHeader>
                    <Divider />
                    <CardBody>
                        <AssignedQuestionsStats studentId={loginuser.studentId} />
                    </CardBody>
                </Card>
            </div>
        </div>
    );
};

export default DashBoard;
