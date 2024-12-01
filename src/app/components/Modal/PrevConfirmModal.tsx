/* ページバック前確認用モーダル */

'use client';

import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Button } from '@nextui-org/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { StudentUseAuth } from '@/hooks/useAuth/StudentUseAuth';
import toast from 'react-hot-toast';

interface PrevConfirmModalProps {
    showFlag: boolean;
    ChangeFlag: () => void;
    apiUrl?: string;
}

export const PrevConfirmModal: React.FC<PrevConfirmModalProps> = (props) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const loginuser = StudentUseAuth();

    const apiUrl = props.apiUrl || "";

    // トレーニングページから離れる処理
    const handleLeavePage = async () => {
        setIsLoading(true);
        try {
            const res = await fetch(apiUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    studentId: loginuser.studentId
                }),
            });
    
            const data = await res.json();

            if(res.ok){
                router.push("/dashboard/training");
                router.refresh();
            } else {
                toast.error(data.message)
            }
        } catch {
            toast.error("エラーが発生しました")
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <Modal backdrop="blur" isOpen={props.showFlag} onOpenChange={props.ChangeFlag}>
                <ModalContent>
                    <ModalHeader className='text-xl '><p><strong>ページを離れますか？</strong></p></ModalHeader>
                    <ModalBody className='sm'>
                        <p>※成績は無効になります</p>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="danger" variant="light" onPress={props.ChangeFlag}>
                            キャンセル
                        </Button>
                        <Button color="primary" disabled={isLoading} onClick={handleLeavePage}>
                            {isLoading ? "処理中..." : "戻る"}
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};
