/* 削除確認用モーダル */

"use client";

import React from "react";
import { Modal, Button, ModalHeader, ModalBody, ModalFooter, ModalContent, Textarea } from "@nextui-org/react";

type DeleteConfirmationModalProps = {
    showFlag: boolean;
    ChangeFlag: () => void;
    onConfirm: () => void;
    message: string;
    role: string;
};

export const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = (props) => {
    return (
        <Modal backdrop="blur" isOpen={props.showFlag} onOpenChange={props.ChangeFlag}>
            <ModalContent>
                {(onClose) => (
                    <>
                        <form onSubmit={props.onConfirm}>
                            <ModalHeader>
                                <strong>この{props.role}を削除しますか？</strong>
                            </ModalHeader>
                            <ModalBody className="justify-center items-center">
                                <Textarea 
                                    isReadOnly
                                    className="max-w-xs"
                                    label={`対象の${props.role}`}
                                    labelPlacement="outside"
                                    defaultValue={props.message}
                                    variant="bordered"
                                />
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
