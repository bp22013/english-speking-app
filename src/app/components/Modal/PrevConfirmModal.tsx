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
    apiUrl?: string;
    answeredQuestionIds: number[]; // 回答済み問題ID
}

export const PrevConfirmModal: React.FC<PrevConfirmModalProps> = (props) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [isNavigationBlocked, setIsNavigationBlocked] = useState(false);
    const loginuser = StudentUseAuth();

    const apiUrl = props.apiUrl || "";

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
            const res = await fetch(apiUrl, {
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
            toast.error("エラーが発生しました");
        } finally {
            setIsLoading(false);
        }
    };

    // モーダルを表示してページ離脱確認
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
        event.preventDefault();
        event.returnValue = ""; // この設定でブラウザの確認メッセージが表示される
    };

    // ブラウザの戻るボタンを押した際にモーダルを表示
    const handlePopState = () => {
        setIsNavigationBlocked(true);
        props.ChangeFlag();
    };

    // イベントリスナーを追加
    useEffect(() => {
        window.addEventListener("beforeunload", handleBeforeUnload);
        window.addEventListener("popstate", handlePopState);

        return () => {
        // クリーンアップ
        window.removeEventListener("beforeunload", handleBeforeUnload);
        window.removeEventListener("popstate", handlePopState);
        };
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
