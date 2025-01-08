/* 削除確認用モーダル */

"use client";

import React from "react";
import { Modal, Button, ModalHeader, ModalBody, ModalFooter, ModalContent } from "@nextui-org/react";

type QuestionDeleteConfirmationModalProps = {
    showFlag: boolean;
    ChangeFlag: () => void;
    onConfirm: () => void;
    message: string;
};

export const QuestionDeleteConfirmationModal: React.FC<QuestionDeleteConfirmationModalProps> = (props) => {
    return (
        <Modal backdrop="blur" isOpen={props.showFlag} onOpenChange={props.ChangeFlag}>
            <ModalContent>
                {(onClose) => (
                    <>
                        <form onSubmit={props.onConfirm}>
                            <ModalHeader>
                                <strong>この問題を削除しますか？</strong>
                            </ModalHeader>
                            <ModalBody className="justify-center items-center">
                                対象の問題 : {props.message}
                            </ModalBody>
                            <ModalFooter>
                                <Button color="primary" variant="ghost" onClick={onClose}>
                                    キャンセル
                                </Button>
                                <Button color="danger" type="submit">
                                    削除する
                                </Button>
                            </ModalFooter>
                        </form>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
};
