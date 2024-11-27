/* 管理者新規登録ページ */

'use client';

import { NextPage } from "next";
import { AdminNavigationbar } from "@/app/components/Navbar/AdminNavbar";
import { Button, Input, Card, CardHeader, CardBody, CardFooter, Divider } from "@nextui-org/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { InputsType, inputs } from "@/schema/RegisterAdminSchema";
import { useForm, SubmitHandler } from "react-hook-form";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useState } from "react";
import { EyeSlashFilledIcon } from "@/app/components/Icon/EyeSlashFilledIcon";
import { EyeFilledIcon } from "@/app/components/Icon/EyeFilledIcon";

const RegisterAdminPage: NextPage = () => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const toggleVisibility = () => setIsVisible(!isVisible);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<InputsType>({
        resolver: zodResolver(inputs),
    });

    const handleBack = () => {
        router.push("/Admindashboard/Register");
        router.refresh();
    };

    //生徒新規登録用関数
    const onRegister: SubmitHandler<InputsType> = async (data) => {
        setIsLoading(true);
        try{
            const response = await fetch("/api/auth/register/student", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: data.email,
                    name: data.name,
                    password: data.password
                }),
            });

            const responseData = await response.json();

            if (!response.ok) {
                toast.error(responseData.message);
                return;
            }

            toast.success("登録成功");
            router.push("/Admindashboard/Register");
            router.refresh();

        } catch(error) {
            toast.error("エラーが発生しました: " + error);
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
                            <p>管理者新規登録</p>
                        </div>
                    </CardHeader>
                    <Divider className="my-4" />
                    <CardBody>
                        <div className="flex flex-col">
                            <Input
                                {...register("email")}
                                autoFocus
                                isClearable
                                label="新しいメールアドレス"
                                placeholder="新しい管理者IDを入力してください"
                                variant="underlined"
                                color={errors.email ? "danger" : "primary"}
                                className="bg-blue-200 mt-8"
                            />
                            {errors.email && (
                                <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
                            )}
                            <Input
                                {...register("name")}
                                isClearable
                                label="新しい名前"
                                placeholder="新しい管理者名を入力してください"
                                variant="underlined"
                                color={errors.name ? "danger" : "primary"}
                                className="bg-blue-200 mt-8"
                            />
                            {errors.name && (
                                <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
                            )}
                            <Input
                                {...register("password")}
                                label="新しいパスワード"
                                placeholder="新しいパスワードを入力してください"
                                variant="underlined"
                                color={errors.name ? "danger" : "primary"}
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
                            onClick={handleSubmit(onRegister)}
                            className="bg-gradient-to-tr from-lime-400 to-green-600 text-white shadow-md"
                        >
                            {isLoading ? "登録中..." : "登録"}
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
};

export default RegisterAdminPage;
