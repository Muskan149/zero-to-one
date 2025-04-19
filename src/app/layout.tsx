// src/app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/layout/header';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'ZeroToOne - Project-based Learning Path Generator',
  description: 'Generate personalized project-based learning paths for CS beginners',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} h-full flex flex-col m-0 p-0`}>
        <Header />
        <main className="flex-1 w-full bg-gray-50 px-12 py-8">
          {children}
        </main>
      </body>
    </html>
  );
}
