/* トレーニングページ */

'use client'

import { NextPage } from "next";
import { StudentNavigationbar } from "@/app/components/Navbar/StudentNavbar";
import { Training } from "./Training";
import { BrowserRouter } from "react-router-dom";

const TrainingPage: NextPage = () => {
    return(
        <>
            <div className='bg-blue-100 min-h-screen'>
                <StudentNavigationbar/>
                <BrowserRouter>
                    <Training/>
                </BrowserRouter>
            </div>
        </>
    );
}

export default TrainingPage;