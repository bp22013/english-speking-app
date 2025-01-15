/* トレーニングページコンポーネント */

'use client';

import { CardHeader, CardBody, CardFooter, Image, Select, SelectItem, Divider } from '@nextui-org/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { GoPencil } from "react-icons/go";
import { StudentUseAuth } from '@/hooks/useAuth/StudentUseAuth';
import dynamic from 'next/dynamic';
import toast from 'react-hot-toast';
import AssignedQuestionsStats from './AchievementReferenceSheet';

// Cardを動的インポートしてSSRを無効化
const Card = dynamic(() => import('@nextui-org/react').then((mod) => mod.Card), { ssr: false });

export const Training = () => {
    const router = useRouter();
    const loginuser = StudentUseAuth();
    const [isPushing, setIsPushing] = useState(false);
    const [level, setLevel] = useState<number | null>(null);
    const [IncorrectLevel, IncorrectsetLevel] = useState<number | null>(null);

    // 問題を解くページに移動
    const PushQuestionPage = () => {
        setIsPushing(true);
        if (level !== null || !Number.isNaN(level)) {
            router.push(`/dashboard/training/QuestionPage?level=${level}`);
        } else {
            if (typeof window !== 'undefined') {
                toast.error("レベルを選択してください");
                setIsPushing(false);
            }
        }
    };

    // 復習するページに移動
    const PushIncorrectQuestionPage = () => {
        setIsPushing(true);
        if (IncorrectLevel !== null || !Number.isNaN(level)) {
            router.push(`/dashboard/training/IncorrectQuestionPage?level=${IncorrectLevel}`);
        } else {
            if (typeof window !== 'undefined') {
                toast.error("レベルを選択してください");
                setIsPushing(false);
            }
        }
    };

    const levelProps = Array.from({ length: 10 }, (_, i) => ({
        key: `${i + 1}`,
        label: `レベル${i + 1}`,
    }));

    return (
        <div className="flex flex-col items-center justify-center my-10 space-y-6 w-full max-w-4xl mx-auto">
            <div className="flex space-x-6 w-full">
                <Card className="flex-1 shadow-md">
                    <CardHeader className="flex items-center justify-center gap-2 text-2xl sm:text-xl h-[50px]">
                        <strong>問題を解く</strong>
                    </CardHeader>
                    <CardBody className="flex flex-col items-center justify-center h-auto space-y-4">
                        <Image
                            src="/ドリル.png"
                            alt="drill"
                            radius="none"
                            className="w-[120px] sm:w-[100px] h-auto"
                        />
                        <Select
                            value={level?.toString()}
                            onChange={(e) => setLevel(parseInt(e.target.value, 10))}
                            placeholder="レベルを選択"
                            isDisabled={isPushing}
                            isRequired
                            size="md"
                            color='primary'
                            className="max-w-xs"
                        >
                            {levelProps.map((item) => (
                                <SelectItem key={item.key}>{item.label}</SelectItem>
                            ))}
                        </Select>
                    </CardBody>
                    <button onClick={PushQuestionPage}>
                        <CardFooter className="bg-gray-600 flex items-center justify-center text-white h-[40px] text-base sm:text-sm">
                            <GoPencil className="mr-2" />
                            <strong>学習する</strong>
                        </CardFooter>
                    </button>
                </Card>

                <Card className="flex-1 shadow-md">
                    <CardHeader className="flex items-center justify-center gap-2 text-2xl sm:text-xl h-[50px]">
                        <strong>復習する</strong>
                    </CardHeader>
                    <CardBody className="flex flex-col items-center justify-center h-auto space-y-4">
                        <Image
                            src="/復習.png"
                            alt="review"
                            radius="none"
                            className="w-[120px] sm:w-[100px] h-auto"
                        />
                        <Select
                            value={IncorrectLevel?.toString()}
                            onChange={(e) => IncorrectsetLevel(parseInt(e.target.value, 10))}
                            placeholder="レベルを選択"
                            isRequired
                            isDisabled={isPushing}
                            size="md"
                            color='primary'
                            className="max-w-xs"
                        >
                            {levelProps.map((item) => (
                                <SelectItem key={item.key}>{item.label}</SelectItem>
                            ))}
                        </Select>
                    </CardBody>
                    <button onClick={PushIncorrectQuestionPage}>
                        <CardFooter className="bg-gray-600 flex items-center justify-center text-white h-[40px] text-base sm:text-sm">
                            <GoPencil className="mr-2" />
                            <strong>復習する</strong>
                        </CardFooter>
                    </button>
                </Card>
            </div>

            <Card className="w-full shadow-md">
                <CardHeader className="text-xl justify-center">
                    <strong>トレーニングの成績</strong>
                </CardHeader>
                <Divider />
                <CardBody>
                    <AssignedQuestionsStats studentId={loginuser.studentId} />
                </CardBody>
            </Card>
        </div>
    );
};