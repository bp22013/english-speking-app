import type { Metadata } from "next";
import { Providers } from "@/lib/Provider";
import { Inter } from "next/font/google";
import { NextFont } from 'next/dist/compiled/@next/font';
import React, { ReactNode, Suspense } from 'react';
import { ToasterContext } from "./context/ToastContext";
import "./styles/globals.css";

const inter: NextFont = Inter({subsets: ['latin']});

export const metadata: Metadata = {
  title: "単語トレーニング",
  description: "単語トレーニング",
};

export default function RootLayout({children}: {children: ReactNode}) {
    return (
        <html lang="en">
            <Suspense>
                <body className={inter.className}>
                    <ToasterContext />
                    <Providers>
                        <div>
                            {children}
                        </div>
                    </Providers>
                </body>
            </Suspense>
        </html>
    );
}
