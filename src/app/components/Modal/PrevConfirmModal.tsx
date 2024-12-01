/* ページバック前確認用モーダル */

'use client';

import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Button } from '@nextui-org/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { StudentUseAuth } from '@/hooks/useAuth/StudentUseAuth';
import toast from 'react-hot-toast';

interface PrevConfirmModalProps {
    showFlag: boolean;
    ChangeFlag: () => void;
    answeredQuestionIds: number[]; // 回答済み問題ID
}

export const PrevConfirmModal: React.FC<PrevConfirmModalProps> = (props) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [isNavigationBlocked, setIsNavigationBlocked] = useState(false);
    const loginuser = StudentUseAuth();

    // トレーニングページから離れる処理
    const handleLeavePage = async () => {
        if (props.answeredQuestionIds.length === 0) {
            // 解答済み問題がない場合はそのまま戻る
            router.push("/dashboard/training");
            router.refresh();
            return;
        }

        setIsLoading(true);
        try {
            const res = await fetch("/api/training/PrevPage", {
                method: "POST",
                headers: {
                "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    studentId: loginuser.studentId,
                    questionIds: props.answeredQuestionIds, // 回答済み問題IDを送信
                }),
            });

            const data = await res.json();

            if (res.ok) {
                toast.success(data.message);
                router.push("/dashboard/training");
                router.refresh();
            } else {
                toast.error(data.error || "データ削除に失敗しました");
            }
        } catch (error) {
            toast.error("エラーが発生しました:" + error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        history.pushState(null, null, null);
        
        window.addEventListener("beforeunload", function(e){
            this.history.pushState(null, null, null);
            return;
        });
        
        window.addEventListener("popstate", function(e){
            this.history.pushState(null, null, null);
            return;
        });

        return;
    }, []);

    return (
        <Modal backdrop="blur" isOpen={props.showFlag || isNavigationBlocked} onOpenChange={props.ChangeFlag}>
            <ModalContent>
                <ModalHeader className="text-xl">
                    <p>
                        <strong>ページを離れますか？</strong>
                    </p>
                </ModalHeader>
                <ModalBody className="sm">
                    <p>※成績は無効になります</p>
                </ModalBody>
                <ModalFooter>
                    <Button
                        color="danger"
                        variant="light"
                        onPress={() => {
                            props.ChangeFlag();
                            setIsNavigationBlocked(false);
                        }}
                    >
                        キャンセル
                    </Button>
                    <Button
                        color="primary"
                        disabled={isLoading}
                        onClick={async () => {
                            await handleLeavePage();
                            setIsNavigationBlocked(false);
                        }}
                    >
                        {isLoading ? "処理中..." : "戻る"}
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};
