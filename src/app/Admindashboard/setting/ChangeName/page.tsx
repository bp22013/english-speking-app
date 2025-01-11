/* 管理者名変更ページ */

'use client';

import { AdminNavigationbar } from '@/app/components/Navbar/AdminNavbar';
import { Button, Card, CardBody, CardFooter, CardHeader, Divider, Input } from '@nextui-org/react';
import { NextPage } from 'next';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AdminUseAuth } from '@/hooks/useAuth/AdminUseAuth';
import toast from 'react-hot-toast';

const ChangeNamePage: NextPage = () => {

    const loginuser = AdminUseAuth();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [userName, setUserName] = useState("");

    const handleBack = () => {
        router.push("/Admindashboard/setting");
    }

    // 名前を変更する関数
    const onSubmit = async () => {
        setIsLoading(true);
        try {
            const response = await fetch("/api/update/admin/name", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    newName: userName,
                    email: loginuser.email,
                }),
            });

            const data = await response.json();
    
            if (!data.success) {
                toast.error(data.message);
                router.push("/Admindashboard/setting");
                router.refresh();
            }

            toast.success(data.message);
            router.push("/");
            router.refresh();
        } catch (error) {
            toast.error("エラーが発生しました:" + error);
            router.push("/Admindashboard/setting");
            router.refresh();
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-blue-100 min-h-screen">
            <AdminNavigationbar />
            <div className="flex justify-center items-center mt-20">
                <Card className="max-w-md w-full shadow-lg">
                    <CardHeader className="flex items-center justify-center h-16">
                        <div className="text-2xl font-bold mt-4">
                            <p>名前変更</p>
                        </div>
                    </CardHeader>
                    <Divider className="my-4" />
                    <CardBody>
                        <div className="flex flex-col">
                            <div className="justify-center items-center mx-auto">
                                <p>現在の名前　:　{loginuser.username}</p>
                            </div>
                            <Input
                                autoFocus
                                isClearable
                                label="new email"
                                placeholder="新しい名前を入力してください"
                                color='success'
                                variant="underlined"
                                className='bg-blue-200'
                                onChange={(e) => setUserName(e.target.value)}
                            />
                        </div>
                    </CardBody>
                    <Divider className="mt-4" />
                    <CardFooter className="flex justify-between">
                        <Button
                            size="lg"
                            color="primary"
                            onClick={handleBack}
                            className="bg-gradient-to-tr from-gray-400 to-gray-600 text-white shadow-md"
                        >
                            戻る
                        </Button>
                        <Button
                            size="lg"
                            color="primary"
                            onClick={onSubmit}
                            isDisabled={isLoading}
                            className="bg-gradient-to-tr from-lime-400 to-green-600 text-white shadow-md"
                        >
                            {isLoading ? "変更中..." : "変更"}
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}

export default ChangeNamePage;