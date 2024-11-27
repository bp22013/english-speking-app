/* 生徒用ログインモーダルコンポーネント */

'use client';

import React, { useState } from "react";
import { Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Input, Link, Spacer } from '@nextui-org/react';
import { useRouter } from 'next/navigation';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { InputsType, inputs } from "@/schema/StudentLoginSchema";
import toast from "react-hot-toast";

interface StudentModalProps {
    showFlag: boolean;
    ChangeFlag: () => void;
}

export const StudentLoginModal: React.FC<StudentModalProps> = (props) => {

    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<InputsType>({
        resolver: zodResolver(inputs)
    });

    const onChangeModal = () => {
        props.ChangeFlag();
        reset(); // フォームをリセット
    };

    const onSubmit: SubmitHandler<InputsType> = async (data) => {
        setIsLoading(true);
        try {
            const res = await fetch("/api/auth/login/student", {
                method: "post",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            const jsondata = await res.json();

            if (jsondata.flg) {
                if ("token" in jsondata) {
                    localStorage.setItem("studenttoken", jsondata.token);
                    toast.success(jsondata.message);
                }
                router.push("/dashboard");
                router.refresh();
            } else {
                toast.error(jsondata.message);
            }
        } catch (error) {
            toast.error("エラーが発生しました:" + error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Modal backdrop="blur" isOpen={props.showFlag} onOpenChange={onChangeModal}>
            <ModalContent>
                {(onClose) => (
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <ModalHeader className="flex flex-col gap-1">ログイン情報を入力</ModalHeader>
                        <ModalBody className="items-center justify-center">
                            <Input
                                {...register("studentId")}
                                autoFocus
                                label="Student ID"
                                placeholder="生徒IDを入力してください"
                                variant="bordered"
                            />
                            {errors.studentId && <p className="text-red-500 text-xs mt-1">{errors.studentId.message}</p>}

                            <Input
                                {...register("password")}
                                label="Password"
                                placeholder="パスワードを入力してください"
                                type="password"
                                variant="bordered"
                            />
                            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}

                            <div className="flex py-2 px-1 justify-between">
                                <Spacer className="px-14" />
                                <Link color="primary" href="#" size="sm">
                                    Forgot password?
                                </Link>
                            </div>
                        </ModalBody>
                        <ModalFooter>
                            <Button color="danger" variant="light" onPress={onClose}>
                                キャンセル
                            </Button>
                            <Button color="primary" type="submit" disabled={isLoading}>
                                {isLoading ? "ログイン中..." : "ログイン"}
                            </Button>
                        </ModalFooter>
                    </form>
                )}
            </ModalContent>
        </Modal>
    );
};
