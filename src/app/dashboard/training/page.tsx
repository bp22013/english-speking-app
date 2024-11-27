/* トレーニングページ */

'use client'

import { NextPage } from "next";
import { StudentNavigationbar } from "@/app/components/Navbar/StudentNavbar";
import { Button, Input } from "@nextui-org/react";
import { useState } from "react";

const TrainingPage: NextPage = () => {
    return(
        <>
            <div className='bg-blue-100 min-h-screen'>
                <StudentNavigationbar/>
            </div>
            
        </>
    );
}

export default TrainingPage;