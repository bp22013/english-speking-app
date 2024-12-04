/* トレーニングページ用ナビゲーションバー */

'use client';

import { Navbar, NavbarContent, Button } from "@nextui-org/react";
import { useRouter } from "next/navigation";

export const TrainingPageNavbar = () => {

    const router = useRouter();
    const handleBackPage = () => {
        router.push("/dashboard/training");
    }

    return(
        <>
            <div className="bg-[#00bfff] text-[#1e90ff]">
                <Navbar isBordered className="'bg-[#00bfff] text-[#1e90ff]'">
                    <NavbarContent justify="start">
                        <Button color="primary" onClick={handleBackPage}>
                            前のページに戻る
                        </Button>
                    </NavbarContent>
                </Navbar>
            </div>
        </>
    );
}