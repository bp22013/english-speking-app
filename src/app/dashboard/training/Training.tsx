/* トレーニングページコンポーネント */

'use client';

import { CardHeader, CardBody, CardFooter, Image, Select, SelectItem } from '@nextui-org/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { GoPencil } from "react-icons/go";
import dynamic from 'next/dynamic';
import toast from 'react-hot-toast';

// Cardを動的インポートしてSSRを無効化
const Card = dynamic(() => import('@nextui-org/react').then((mod) => mod.Card), { ssr: false });

export const Training = () => {
    const router = useRouter();
    const [level, setLevel] = useState<number | null>(null);
    const [IncorrectLevel, IncorrectsetLevel] = useState<number | null>(null);

    // 問題を解くページに移動
    const PushQuestionPage = () => {
        if (level !== null) {
            router.push(`/dashboard/training/QuestionPage?level=${level}`);
        } else {
            // クライアントサイド専用の処理を保証
            if (typeof window !== 'undefined') {
                toast.error("レベルを選択してください");
            }
        }
    };

    // 復習するページに移動
    const PushIncorrectQuestionPage = () => {
        if (IncorrectLevel !== null) {
            router.push(`/dashboard/training/IncorrectQuestionPage?level=${IncorrectLevel}`);
        } else {
            if (typeof window !== 'undefined') {
                toast.error("レベルを選択してください");
            }
        }
    };

    const levelProps = Array.from({ length: 10 }, (_, i) => ({
        key: `${i + 1}`,
        label: `${i + 1}`,
    }));

    return (
        <div className="container mx-auto px-4 flex flex-col items-center transform scale-100 md:scale-90 sm:scale-60 sm:mt-10 ">
            <div className="flex flex-wrap justify-center gap-20 lg:gap-48">
                <div>
                    <Card className="w-[160px] h-[215px] sm:w-[140px] sm:h-[190px]" isPressable onPress={PushQuestionPage}>
                        <CardHeader className="flex items-center justify-center gap-2 text-2xl sm:text-xl h-[45px] sm:h-[40px]">
                            <p>
                                <strong>問題を解く</strong>
                            </p>
                        </CardHeader>
                        <CardBody className="flex items-center justify-center h-[100px] sm:h-[90px]">
                            <Image
                                src="/ドリル.png"
                                alt="drill"
                                radius="none"
                                className="w-[120px] sm:w-[100px] h-auto"
                            />
                        </CardBody>
                        <CardFooter className="bg-gray-600 flex items-center justify-center text-white h-[40px] sm:h-[35px] text-base sm:text-sm">
                            <GoPencil className="mr-2" />
                            <p>
                                <strong>学習する</strong>
                            </p>
                        </CardFooter>
                    </Card>
                    <Select
                        value={level?.toString()}
                        onChange={(e) => setLevel(parseInt(e.target.value, 10))}
                        placeholder="レベルを選択"
                        size="md"
                        className="max-w-xs mt-3"
                    >
                        {levelProps.map((item) => (
                            <SelectItem key={item.key}>{item.label}</SelectItem>
                        ))}
                    </Select>
                </div>

                <div>
                    <Card className="w-[160px] h-[215px] sm:w-[140px] sm:h-[190px]" isPressable onPress={PushIncorrectQuestionPage}>
                        <CardHeader className="flex items-center justify-center gap-2 text-2xl sm:text-xl h-[45px] sm:h-[40px]">
                            <p>
                                <strong>復習する</strong>
                            </p>
                        </CardHeader>
                        <CardBody className="flex items-center justify-center h-[100px] sm:h-[90px]">
                            <Image
                                src="/復習.png"
                                alt="review"
                                radius="none"
                                className="w-[120px] sm:w-[100px] h-auto"
                            />
                        </CardBody>
                        <CardFooter className="bg-gray-600 flex items-center justify-center text-white h-[40px] sm:h-[35px] text-base sm:text-sm">
                            <GoPencil className="mr-2" />
                            <p>
                                <strong>学習する</strong>
                            </p>
                        </CardFooter>
                    </Card>
                    <Select
                        value={IncorrectLevel?.toString()}
                        onChange={(e) => IncorrectsetLevel(parseInt(e.target.value, 10))}
                        placeholder="レベルを選択"
                        size="md"
                        className="max-w-xs mt-3"
                    >
                        {levelProps.map((item) => (
                            <SelectItem key={item.key}>{item.label}</SelectItem>
                        ))}
                    </Select>
                </div>
            </div>
        </div>
    );
};
