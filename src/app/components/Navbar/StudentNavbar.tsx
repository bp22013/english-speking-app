/* 生徒用ナビゲーションバーコンポーネント */

'use client';

import React, { useEffect, useState } from 'react';
import { HiOutlineSpeakerphone } from "react-icons/hi";
import { usePathname, useRouter } from 'next/navigation';
import { StudentUseAuth } from '@/hooks/useAuth/StudentUseAuth';
import {
    Badge,
    Dropdown,
    DropdownTrigger,
    DropdownMenu,
    DropdownItem,
    Link,
    Navbar,
    NavbarContent,
    NavbarMenuToggle,
    NavbarBrand,
    NavbarItem,
    NavbarMenu,
    NavbarMenuItem
} from '@nextui-org/react';
import toast from 'react-hot-toast';

export interface NavItemProps {
    Link: string;
    Display: string;
}

export const StudentNavigationbar = () => {
    const loginuser = StudentUseAuth();
    const router = useRouter();
    const pathname: string = usePathname();
    const [unreadCount, setUnreadCount] = useState(0); // 新規通知数を管理する状態

    const isActive = (link: string): boolean => {
        return pathname === link;
    };

    const PushNotification = () => {
        router.push("/dashboard/notification");
        router.refresh();
    };

    // 新規通知数を取得する関数
    const fetchUnreadCount = async () => {
        try {
            const response = await fetch("/api/notification/GetNumberOfNewNotification", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    studentId: loginuser.studentId, // 生徒IDを送信
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setUnreadCount(data.unreadCount || 0); // 通知数を更新
            } else {
                console.error("Failed to fetch unread notifications:", data.error);
            }
        } catch (error) {
            console.error("Error fetching unread notifications:", error);
        }
    };

    // コンポーネントの初回マウント時に新規通知数を取得
    useEffect(() => {
        if (loginuser.studentId) {
            fetchUnreadCount();
        }
    }, [loginuser.studentId]);

    const MenuItems: NavItemProps[] = [
        {
            Display: 'ホーム',
            Link: '/dashboard',
        },
        {
            Display: 'トレーニング',
            Link: '/dashboard/training',
        },
        {
            Display: '設定',
            Link: '/dashboard/setting',
        },
    ];

    // ログアウト用関数
    const handleLogout = async (studentId: string) => {
        const promise = new Promise<void>(async (resolve, reject) => {
            try {
                const res = await fetch("/api/auth/logout/student", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ studentId }),
                });

                const data = await res.json();

                if (res.ok && data.success) {
                    resolve(); // 成功
                } else {
                    reject(data.message || "ログアウトに失敗しました"); // エラー
                }
            } catch (error) {
                reject("サーバーエラーが発生しました: " + error); // サーバーエラー
            }
        });

        toast.promise(
            promise,
            {
                loading: "ログアウト中...",
                success: "ログアウトしました！",
                error: (err) => `${err}`, // エラーメッセージを表示
            }
        );

        promise.then(() => {
            router.push("/");
            router.refresh();
        });
    };

    return (
        <div className='bg-[#00bfff] text-[#1e90ff]'>
            <Navbar isBordered classNames={{
                item: [
                    'ml-auto',
                    'flex',
                    'relative',
                    'h-full',
                    'items-center',
                    "data-[active=true]:after:content-['']",
                    'data-[active=true]:after:absolute',
                    'data-[active=true]:after:bottom-[-19px]',
                    'data-[active=true]:after:left-0',
                    'data-[active=true]:after:right-0',
                    'data-[active=true]:after:h-[3px]',
                    'data-[active=true]:after:rounded-[2px]',
                    'data-[active=true]:after:bg-blue-600',
                    'data-[active=true]:after:text-blue-600',
                ],
            }}>
                <NavbarContent className="sm:hidden" justify="start">
                    <NavbarMenuToggle />
                </NavbarContent>

                <NavbarContent justify="start" className="pr-3">
                    <NavbarBrand>
                        <p className="font-bold text-inherit">仮タイトル</p>
                    </NavbarBrand>
                </NavbarContent>

                <NavbarContent className="hidden sm:flex justify-center w-full flex-grow ml-64 mr-auto">
                    <div className="flex space-x-6">
                        {MenuItems.map((item: NavItemProps, index: number) => (
                            <NavbarItem key={index} isActive={isActive(item.Link)}>
                                <Link color='primary' href={`${item.Link}`}>
                                    {item.Display}
                                </Link>
                            </NavbarItem>
                        ))}
                    </div>
                </NavbarContent>

                <NavbarContent className="ml-auto flex ml-64 mr-auto relative">
                    <div className="relative">
                        {unreadCount > 0 ? (
                            <Badge content={unreadCount} size='md' color='danger'>
                                <HiOutlineSpeakerphone size={28} style={{ cursor: 'pointer' }} onClick={PushNotification} />
                            </Badge>
                        ) : (
                            <HiOutlineSpeakerphone size={28} style={{ cursor: 'pointer' }} onClick={PushNotification} />
                        )}
                    </div>
                    <Dropdown>
                        <DropdownTrigger>
                            <a className="rounded-md px-3.5 py-0.5 m-1 overflow-hidden relative group cursor-pointer border-2 font-medium border-blue-400 text-blue-400 text-white">
                                <span className="absolute w-64 h-0 transition-all duration-300 origin-center rotate-45 -translate-x-20 bg-[#45ccc8] top-1/2 group-hover:h-64 group-hover:-translate-y-32 ease"></span>
                                <span className="relative text-sky-600 transition duration-300 group-hover:text-white ease">Menu</span>
                            </a>
                        </DropdownTrigger>
                        <DropdownMenu aria-label="Static Actions">
                            <DropdownItem key="setting" href='/dashboard/setting'><strong>設定</strong></DropdownItem>
                            <DropdownItem 
                                key="logout"
                                color="danger"
                                variant="flat"
                                style={{ color: 'red' }}
                                onClick={() => handleLogout(loginuser.studentId)}
                            >
                                <strong>ログアウト</strong>
                            </DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                </NavbarContent>
                <NavbarMenu>
                    {MenuItems.map((item: NavItemProps, index: number) => (
                        <NavbarMenuItem key={index} isActive={isActive(item.Link)}>
                            <Link color='primary' href={`${item.Link}`}>
                                {item.Display}
                            </Link>
                        </NavbarMenuItem>
                    ))}
                </NavbarMenu>
            </Navbar>
        </div>
    );
};
