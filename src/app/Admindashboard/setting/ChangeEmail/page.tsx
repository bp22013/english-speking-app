/* 管理者用メールアドレス変更ページ */

'use client'

import { NextPage } from "next";
import { AdminNavigationbar } from "@/app/components/Navbar/AdminNavbar";
import { Button, Input, Card, CardHeader, CardBody, CardFooter, Divider } from "@nextui-org/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { InputsType, inputs } from "@/schema/ChangeAdminEmailSchema";
import { useForm, SubmitHandler } from "react-hook-form";
import { useRouter } from "next/navigation";
import { AdminUseAuth } from "@/hooks/useAuth/AdminUseAuth";
import toast from "react-hot-toast";
import clsx from "clsx";
import { useState } from "react";

const ChangeEmailPage: NextPage = () => {
    const router = useRouter();
    const loginuser = AdminUseAuth();
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<InputsType>({
        resolver: zodResolver(inputs),
    });

    const handleBack = () => {
        router.push("/Admindashboard/setting");
        router.refresh();
    };

    //メールアドレス変更用関数
    const onSubmit: SubmitHandler<InputsType> = async (data) => {
        setIsLoading(true);
        try {
            const response = await fetch("/api/update/admin/email", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    newEmail: data.email,
                    confirmEmail: data.confirmEmail,
                    oldEmail: loginuser.email,
                }),
            });

            const responceData = await response.json();
    
            if (!responceData.success) {
                toast.error(responceData.message);
                router.push("/Admindashboard/setting");
                router.refresh();
            }

            toast.success(responceData.message);
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
                            <p>メールアドレス変更</p>
                        </div>
                    </CardHeader>
                    <Divider className="my-4" />
                    <CardBody>
                        <div className="flex flex-col">
                            <div className="justify-center items-center mx-auto">
                                <p>現在のメールアドレス　:　{loginuser.email}</p>
                            </div>
                            <Input
                                {...register("email")}
                                autoFocus
                                isClearable
                                label="new email"
                                placeholder="新しいメールアドレスを入力してください"
                                variant="underlined"
                                color={errors.email ? "danger" : "success"}
                                className={clsx(
                                    "mt-8",
                                    errors.email ? "bg-red-200" : "bg-blue-200"
                                )}
                            />
                            {errors.email && (
                                <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
                            )}

                            <Input
                                {...register("confirmEmail")}
                                isClearable
                                label="confirm new email"
                                placeholder="もう一度メールアドレスを入力してください"
                                variant="underlined"
                                color={errors.confirmEmail ? "danger" : "success"}
                                className={clsx(
                                    "mt-8",
                                    errors.confirmEmail ? "bg-red-200" : "bg-blue-200"
                                )}
                            />
                            {errors.confirmEmail && (
                                <p className="text-red-500 text-xs mt-1">{errors.confirmEmail.message}</p>
                            )}
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
                            onClick={handleSubmit(onSubmit)}
                            className="bg-gradient-to-tr from-lime-400 to-green-600 text-white shadow-md"
                        >
                            {isLoading ? "変更中..." : "変更"}
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
};

export default ChangeEmailPage;
