/* トレーニングページ用ナビゲーションバー */

'use client';

import { Navbar, NavbarContent, useDisclosure, Button } from "@nextui-org/react";
import { PrevConfirmModal } from "../Modal/PrevConfirmModal";

interface QuestionProps {
    answeredQuestionIds: number[];
}

export const TrainingPageNavbar: React.FC<QuestionProps> = (props) => {

    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const apiUrl = "/api/training/PrevPage/sort"

    return(
        <>
            <div className="bg-[#00bfff] text-[#1e90ff]">
                <Navbar isBordered className="'bg-[#00bfff] text-[#1e90ff]'">
                    <NavbarContent justify="start">
                        <Button onClick={onOpen} color="primary">
                            前のページに戻る
                        </Button>
                    </NavbarContent>
                </Navbar>
                <PrevConfirmModal showFlag={isOpen} ChangeFlag={onOpenChange} apiUrl={apiUrl} answeredQuestionIds={props.answeredQuestionIds} />
            </div>
        </>
    );
}