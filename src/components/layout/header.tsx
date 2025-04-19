// src/components/layout/header.tsx
import Link from 'next/link';
import { Navigation } from './navigation';

export function Header() {
  return (
    <header className="border-b border-gray-200 py-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link href="/" className="flex items-center">
          <h1 className="text-2xl font-bold text-purple-600">ZeroToOne</h1>
          {/* <p className="text-sm text-gray-600 ml-2">Project-based learning path generator for CS beginners</p> */}
        </Link>
        <Navigation />
      </div>
    </header>
  );
}