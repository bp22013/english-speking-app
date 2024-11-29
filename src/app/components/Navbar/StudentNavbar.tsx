/* 生徒用ナビゲーションバーコンポーネント */

'use client';

import React from 'react';
import { HiOutlineSpeakerphone } from "react-icons/hi";
import { MdMessage } from "react-icons/md";
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { StudentUseAuth } from '@/hooks/useAuth/StudentUseAuth';
import { Popover, PopoverTrigger, PopoverContent, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Link, Navbar, NavbarContent, NavbarMenuToggle, NavbarBrand, NavbarItem, NavbarMenu, NavbarMenuItem } from '@nextui-org/react';
import toast from 'react-hot-toast';

export interface NavItemProps {
    Link: string;
    Display: string;
}

export const StudentNavigationbar = () => {

    const loginuser = StudentUseAuth();
    const router = useRouter();
    const pathname: string = usePathname();

    const isActive = (link: string): boolean => {
        return pathname === link;
    }

    const PushNotification = () => {
        router.push("/dashboard/notification");
        router.refresh();
    }

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

    const handleLogout = async (studentId: string) => {
        try {
            // サーバーにログアウトリクエストを送信
            const res = await fetch("/api/auth/logout/student", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ studentId }),
            });
    
            const data = await res.json();
            if (data.success) {
                toast.success("ログアウト成功");
                // 必要に応じてページをリダイレクト
                router.push("/");
                router.refresh();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error("サーバーエラーが発生しました:" + error);
        }
    };

    return (
        <>
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
                                <NavbarItem
                                    key={index}
                                    isActive={isActive(item.Link)}>
                                    <Link
                                        color='primary'
                                        href={`${item.Link}`}>
                                        {item.Display}
                                    </Link>
                                </NavbarItem>
                            ))}
                        </div>
                    </NavbarContent>

                    <NavbarContent className="ml-auto flex ml-64 mr-auto">
                        <Popover placement="bottom">
                            <HiOutlineSpeakerphone size={28} style={{ cursor: 'pointer' }} onClick={PushNotification}/>
                        </Popover>
                        <Popover placement="bottom">
                            <PopoverTrigger>
                                <MdMessage size={28} style={{ cursor: 'pointer' }} />
                            </PopoverTrigger>
                            <PopoverContent>
                                <p className="p-4">メッセージ</p>
                            </PopoverContent>
                        </Popover>
                        <Dropdown>
                            <DropdownTrigger>
                                <a className="rounded-md px-3.5 py-0.5 m-1 overflow-hidden relative group cursor-pointer border-2 font-medium border-blue-400 text-blue-400 text-white">
                                    <span className="absolute w-64 h-0 transition-all duration-300 origin-center rotate-45 -translate-x-20 bg-[#45ccc8] top-1/2 group-hover:h-64 group-hover:-translate-y-32 ease"></span>
                                    <span className="relative text-sky-600 transition duration-300 group-hover:text-white ease">Menu</span>
                                </a>
                            </DropdownTrigger>
                            <DropdownMenu aria-label="Static Actions">
                                <DropdownItem key="setting" href='/dashboard/setting'><strong>設定</strong></DropdownItem>
                                <DropdownItem key="logout" color="danger" variant="flat" style={{ color: 'red' }} onClick={() => handleLogout(loginuser.studentId)}>
                                    <strong>ログアウト</strong>
                                </DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                    </NavbarContent>
                    <NavbarMenu>
                        {MenuItems.map((item: NavItemProps, index: number) => (
                            <NavbarMenuItem
                                key={index}
                                isActive={isActive(item.Link)}>
                                <Link
                                    color='primary'
                                    href={`${item.Link}`}>
                                    {item.Display}
                                </Link>
                            </NavbarMenuItem>
                        ))}
                    </NavbarMenu>
                </Navbar>
            </div>
        </>
    );
};
