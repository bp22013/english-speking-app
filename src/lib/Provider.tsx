'use client';

import { NextUIProvider } from '@nextui-org/react';
import { useRouter } from 'next/navigation';
import React, { ReactNode } from 'react';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

export function Providers({children}: {children: ReactNode}) {
    const router: AppRouterInstance = useRouter();
    return (
        <NextUIProvider navigate={router.push}>{children}</NextUIProvider>
    );
}