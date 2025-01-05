/* 管理者用ログインモーダルコンポーネント */

'use client';

import React, { useState } from "react";
import { Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Input, Link, Spacer } from '@nextui-org/react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { InputsType, inputs } from "@/schema/AdminLoginSchema";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { EyeSlashFilledIcon } from "@/app/components/Icon/EyeSlashFilledIcon";
import { EyeFilledIcon } from "@/app/components/Icon/EyeFilledIcon";

interface AdminModalProps {
    showFlag: boolean;
    ChangeFlag: () => void;
}

export const AdminLoginModal: React.FC<AdminModalProps> = (props) => {

    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const [isVisible, setIsVisible] = useState(false);
    const toggleVisibility = () => setIsVisible(!isVisible);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<InputsType>({
        resolver: zodResolver(inputs),
    });

    // モーダルを閉じる処理
    const onChangeModal = () => {
        props.ChangeFlag();
        reset(); // フォームをリセット
    };

    // フォーム送信処理
    const onSubmit: SubmitHandler<InputsType> = async (data) => {
        setIsLoading(true);

        toast.promise(
            new Promise(async (resolve, reject) => {
                try {
                    const res = await fetch("/api/auth/login/admin", {
                        method: "POST",
                        headers: {
                            Accept: "application/json",
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(data),
                    });

                    const jsondata = await res.json();

                    if (jsondata.flg) {
                        resolve(jsondata.message); // 成功時のメッセージ
                        router.push("/Admindashboard");
                        router.refresh();
                    } else {
                        reject(jsondata.message); // サーバーからのエラーを渡す
                    }
                } catch {
                    reject("エラーが発生しました。もう一度お試しください。");
                } finally {
                    setIsLoading(false);
                }
            }),
            {
                loading: "ログインしています...",
                success: "ログインしました！",
                error: (message: string) => message, // サーバーエラーをそのまま表示
            }
        );
    };

    return (
        <>
            <Modal backdrop="blur" isOpen={props.showFlag} onOpenChange={onChangeModal}>
                <ModalContent>
                    {(onClose) => (
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <ModalHeader className="flex flex-col gap-1">ログイン情報を入力</ModalHeader>
                            <ModalBody className="items-center justify-center">
                                <Input
                                    {...register("email")}
                                    autoFocus
                                    isClearable
                                    label="email"
                                    placeholder="メールアドレスを入力してください"
                                    variant="bordered"
                                />
                                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}

                                <Input
                                    {...register("password")}
                                    label="Password"
                                    placeholder="パスワードを入力してください"
                                    variant="bordered"
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
                                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}

                                <div className="flex py-2 px-1 justify-between">
                                    <Spacer className="px-14" />
                                    <Link color="primary" href="#" size="sm">
                                        パスワードを忘れた場合はこちら
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
        </>
    );
};
