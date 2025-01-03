/* トレーニングページ */

'use client'

import { NextPage } from "next";
import { StudentNavigationbar } from "@/app/components/Navbar/StudentNavbar";
import { Training } from "./Training";

const TrainingPage: NextPage = () => {
    return(
        <>
            <div className='bg-blue-100 min-h-screen'>
                <StudentNavigationbar/>
                <Training/>
            </div>
        </>
    );
}

export default TrainingPage;