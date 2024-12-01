/* トレーニングページコンポーネント */

'use client';

import { Card, CardHeader, CardBody, CardFooter, Image } from '@nextui-org/react';
import { useRouter } from 'next/navigation';
import { GoPencil } from "react-icons/go";

export const Training = () => {

    const router = useRouter();

    // 仕分けページへプッシュ
    const PushSortPage = () => {
        router.push("/dashboard/training/sort");
    }

    // ドリルページにプッシュ
    const PushDrillPage = () => {
        router.push("/dashboard/training/drill");
    }

    // 復習ページへプッシュ
    const PushReviewPage = () => {
        router.push("/dashboard/training/review");
    }

    return (
        <>
            <div className="container mx-auto px-4 flex flex-col items-center transform scale-100 md:scale-90 sm:scale-60 sm:mt-10 ">
                <div className="flex justify-center sm:mb-14 mb-8">
                    <Card className="w-[160px] h-[215px] sm:w-[140px] sm:h-[190px]" isPressable onPress={PushSortPage}>
                        <CardHeader className="flex items-center justify-center gap-2 text-2xl sm:text-xl h-[45px] sm:h-[40px]">
                            <p>
                                <strong>仕分け</strong>
                            </p>
                        </CardHeader>
                        <CardBody className="flex items-center justify-center h-[100px] sm:h-[90px]">
                            <Image
                                src="/仕分け.png"
                                alt="sort"
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
                </div>

                <div className="flex flex-wrap justify-center gap-20 lg:gap-48">
                    <Card className="w-[160px] h-[215px] sm:w-[140px] sm:h-[190px]" isPressable onPress={PushDrillPage}>
                        <CardHeader className="flex items-center justify-center gap-2 text-2xl sm:text-xl h-[45px] sm:h-[40px]">
                            <p>
                                <strong>ドリル</strong>
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

                    <Card className="w-[160px] h-[215px] sm:w-[140px] sm:h-[190px]" isPressable onPress={PushReviewPage}>
                        <CardHeader className="flex items-center justify-center gap-2 text-2xl sm:text-xl h-[45px] sm:h-[40px]">
                            <p>
                                <strong>復習</strong>
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
                </div>
            </div>
        </>
    );
};
