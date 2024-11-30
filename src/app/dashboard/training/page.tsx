/* トレーニングページ */

'use client'

import { NextPage } from "next";
import { StudentNavigationbar } from "@/app/components/Navbar/StudentNavbar";

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