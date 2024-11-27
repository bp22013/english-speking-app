/* 管理者用パスワード変更前旧パスワード確認モーダル */

'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { InputsType, inputs } from "@/schema/ConfirmAdminPasswordSchema";
import { AdminUseAuth } from '@/hooks/useAuth/AdminUseAuth';
import toast from "react-hot-toast";
import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@nextui-org/react';
import { EyeSlashFilledIcon } from "@/app/components/Icon/EyeSlashFilledIcon";
import { EyeFilledIcon } from "@/app/components/Icon/EyeFilledIcon";

interface AdminPasswordCheckModalProps {
    showFlag: boolean;
    ChangeFlag: () => void;
    apiUrl?: string;
}

export const AdminPasswordCheckModal: React.FC<AdminPasswordCheckModalProps> = (props) => {

    const router = useRouter();
    const loginuser = AdminUseAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const toggleVisibility = () => setIsVisible(!isVisible);

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

    //パスワード変更ページへpushする関数
    const handlePush: SubmitHandler<InputsType> = async (data) => {
        setIsLoading(true);
    
        try {
            const email = loginuser.email;
    
            if (!email) {
                toast.error("メールアドレスが取得できませんでした。再ログインしてください。");
                router.push("/");
                router.refresh();
            }
    
            const apiUrl = props.apiUrl || "" ;
    
            const response = await fetch("/api/auth/confirm", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: email,
                    password: data.password,
                }),
            });
    
            const responseData = await response.json();
    
            if (!response.ok) {
                toast.error(responseData.message);
                return;
            }
    
            toast.success("パスワード確認成功");
            props.ChangeFlag();
            router.push(apiUrl);
            router.refresh();
        } catch {
            toast.error("エラーが発生しました");
        } finally {
            setIsLoading(false);
        }
    };
    

    return (
        <Modal backdrop="blur" isOpen={props.showFlag} onOpenChange={onChangeModal}>
            <ModalContent>
                {(onClose) => (
                    <form onSubmit={handleSubmit(handlePush)}>
                        <ModalHeader className="flex flex-col gap-1">パスワードを入力</ModalHeader>
                        <ModalBody className="items-center justify-center">
                            <Input
                                {...register("password")}
                                autoFocus
                                label="Password"
                                placeholder="旧パスワードを入力してください"
                                color={errors.password ? "danger" : "primary"}
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
                        </ModalBody>
                        <ModalFooter>
                            <Button color="danger" variant="light" onPress={onClose}>
                                キャンセル
                            </Button>
                            <Button color="primary" type="submit" disabled={isLoading}>
                                {isLoading ? "確認中..." : "確認"}
                            </Button>
                        </ModalFooter>
                    </form>
                )}
            </ModalContent>
        </Modal>
    );
}