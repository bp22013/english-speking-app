'use client';

import { NextPage } from "next";
import { StudentNavigationbar } from "@/app/components/Navbar/StudentNavbar";
import { Button, Input } from "@nextui-org/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { InputsType, inputs } from "@/schema/ChangeStudentSchema";
import { useForm, SubmitHandler } from "react-hook-form";
import { StudentUseAuth } from "@/hooks/useAuth/StudentUseAuth";
import toast from "react-hot-toast";
import clsx from "clsx"; // クラス名を動的に管理するためのライブラリ

const SettingPage: NextPage = () => {
    const loginuser = StudentUseAuth();
    const router = useRouter();
    const [studentId, setStudentId] = useState('');
    const [name, setName] = useState('');

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<InputsType>({
        resolver: zodResolver(inputs)
    });

    // 変更処理
    const onSubmit: SubmitHandler<InputsType> = async (data) => {
        try {
            const response = await fetch("/api/update/student", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    studentId: loginuser.studentId,
                    newStudentId: data.studentId,
                    newName: data.name,
                }),
            });

            const responseData = await response.json();

            if (!responseData.success) {
                toast.error(responseData.message);
                router.refresh();
            }

            toast.success(responseData.message);
            router.push("/");
            router.refresh();
        } catch (error) {
            toast.error("エラーが発生しました:" + error);
        }
    };

    return (
        <>
            <div className="bg-blue-100 min-h-screen">
                <StudentNavigationbar />
                <div style={{ marginLeft: '350px' }} className="mt-10">
                    <div className="text-4xl">
                        <p>
                            <strong>設定</strong>
                        </p>
                    </div>
                    <div className="ml-10">
                        <div className="flex mt-10">
                            <Input
                                {...register("studentId")}
                                autoFocus
                                label="Student ID"
                                placeholder="新しい生徒IDを入力して下さい"
                                variant="underlined"
                                value={studentId}
                                color={errors.studentId ? "danger" : "primary"}
                                className={clsx(
                                    "w-64", 
                                    errors.studentId ? "bg-red-200" : "bg-blue-200"
                                )}
                                onChange={(e) => setStudentId(e.target.value)}
                            />
                            <p className=" ml-5 my-auto">現在のID : {loginuser.studentId}</p>
                        </div>
                        {errors.studentId && <p className="text-red-500 text-xs mt-1">{errors.studentId.message}</p>}
                        <div className="flex mt-10">
                            <Input
                                {...register("name")}
                                label="Name"
                                placeholder="新しい名前を入力して下さい"
                                variant="underlined"
                                color={errors.name ? "danger" : "primary"}
                                value={name}
                                className={clsx(
                                    "w-64",
                                    errors.name ? "bg-red-200" : "bg-blue-200"
                                )}
                                onChange={(e) => setName(e.target.value)}
                            />
                            <p className=" ml-5 my-auto">現在の名前 : {loginuser.username}</p>
                        </div>
                        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                    </div>
                    <Button className=" bg-gradient-to-tr from-lime-400 to-green-600 text-white shadow-lg mt-20 ml-52 text-xl" size="lg" color="primary" onClick={handleSubmit(onSubmit)}>
                        変更
                    </Button>
                </div>
            </div>
        </>
    );
};

export default SettingPage;
