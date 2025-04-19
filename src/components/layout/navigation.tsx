// src/components/layout/navigation.tsx
'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';

export function Navigation() {
  // const pathname = usePathname();

  return (
    <nav className="flex items-center space-x-6">
      {/* <Link
        href="/"
        className={cn(
          "font-medium text-medium text-gray-600 hover:text-purple-600 transition-colors"
        )}
      >
        Home
      </Link> */}
      <Link
        href="/generate"
        className={cn(
            "font-medium text-sm text-gray-600 hover:text-purple-600 transition-colors"
        )}
      >
        Generate Ideas
      </Link>
      <Link
        href="/projects"
        className={cn(
            "font-medium text-sm text-gray-600 hover:text-purple-600 transition-colors"
        )}
      >
        My Ideas
      </Link>
    </nav>
  );
}