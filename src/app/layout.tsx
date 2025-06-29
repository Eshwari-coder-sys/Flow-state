
"use client"

import { usePathname } from 'next/navigation';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import MainLayout from '@/components/layout/main-layout';
import { DonorProvider } from '@/context/donor-context';
import React from 'react';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const publicRoutes = ['/', '/login', '/signup'];
  const isAppPage = !publicRoutes.includes(pathname);
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <html lang="en" suppressHydrationWarning>
        <body />
      </html>
    );
  }


  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>FlowState - Modern Blood Management</title>
        <meta name="description" content="A modern blood management system powered by AI." />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        ></link>
      </head>
      <body className="font-body antialiased">
        <DonorProvider>
          {isAppPage ? <MainLayout>{children}</MainLayout> : children}
          <Toaster />
        </DonorProvider>
      </body>
    </html>
  );
}
