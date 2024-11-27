/* 管理者用パスワード変更ページ */

'use client'

import { NextPage } from "next";
import { AdminNavigationbar } from "@/app/components/Navbar/AdminNavbar";
import { Button, Input, Card, CardHeader, CardBody, CardFooter, Divider } from "@nextui-org/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { InputsType, inputs } from "@/schema/ChangeAdminPasswordSchema";
import { useForm, SubmitHandler } from "react-hook-form";
import { useRouter } from "next/navigation";
import { AdminUseAuth } from "@/hooks/useAuth/AdminUseAuth";
import toast from "react-hot-toast";
import { useState } from "react";
import { EyeSlashFilledIcon } from "@/app/components/Icon/EyeSlashFilledIcon";
import { EyeFilledIcon } from "@/app/components/Icon/EyeFilledIcon";

const ChangeEmailPage: NextPage = () => {
    const router = useRouter();
    const loginuser = AdminUseAuth();
    const [isLoading, setIsLoading] = useState(false);

    // 各パスワードフィールドの表示状態
    const [isVisible, setIsVisible] = useState(false);
    const [isConfirmVisible, setIsConfirmVisible] = useState(false);

    const toggleVisibility = () => setIsVisible(!isVisible);
    const toggleConfirmVisibility = () => setIsConfirmVisible(!isConfirmVisible);

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

    // パスワード変更用関数
    const onSubmit: SubmitHandler<InputsType> = async (data) => {
        setIsLoading(true);
        try {
            const response = await fetch("/api/update/admin/password", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    newPassword: data.password,
                    confirmPassword: data.confirmPassword,
                    email: loginuser.email,
                }),
            });

            const responseData = await response.json();
    
            if (!responseData.success) {
                toast.error(responseData.message);
                router.push("/Admindashboard/setting");
                router.refresh();
            }

            toast.success(responseData.message);
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
                            <p>パスワード変更</p>
                        </div>
                    </CardHeader>
                    <Divider className="my-4" />
                    <CardBody>
                        <div className="flex flex-col">
                            {/* 新しいパスワード入力 */}
                            <Input
                                {...register("password")}
                                autoFocus
                                label="新しいパスワード"
                                placeholder="新しいパスワードを入力してください"
                                variant="underlined"
                                color={errors.password ? "danger" : "primary"}
                                className="bg-blue-200 mt-8"
                                endContent={
                                    <button
                                        className="focus:outline-none"
                                        type="button"
                                        onClick={toggleVisibility}
                                        aria-label="toggle password visibility"
                                    >
                                        {isVisible ? (
                                            <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                                        ) : (
                                            <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                                        )}
                                    </button>
                                }
                                type={isVisible ? "text" : "password"}
                            />
                            {errors.password && (
                                <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
                            )}

                            {/* パスワード確認入力 */}
                            <Input
                                {...register("confirmPassword")}
                                label="パスワード確認"
                                placeholder="もう一度パスワードを入力してください"
                                variant="underlined"
                                color={errors.confirmPassword ? "danger" : "primary"}
                                className="bg-blue-200 mt-8"
                                endContent={
                                    <button
                                        className="focus:outline-none"
                                        type="button"
                                        onClick={toggleConfirmVisibility}
                                        aria-label="toggle password visibility"
                                    >
                                        {isConfirmVisible ? (
                                            <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                                        ) : (
                                            <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                                        )}
                                    </button>
                                }
                                type={isConfirmVisible ? "text" : "password"}
                            />
                            {errors.confirmPassword && (
                                <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>
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
