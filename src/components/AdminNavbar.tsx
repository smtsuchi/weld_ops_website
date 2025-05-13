'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
// import { signOut } from 'next-auth/react';


const AdminNavbar = () => {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white';
  };

  return (
    <nav className="bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link href="/admin" className="text-white font-bold">
                Admin Dashboard
              </Link>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <Link
                  href="/admin"
                  className={`${isActive('/admin')} px-3 py-2 rounded-md text-sm font-medium`}
                >
                  Dashboard
                </Link>
                <Link
                  href="/admin/services"
                  className={`${isActive('/admin/services')} px-3 py-2 rounded-md text-sm font-medium`}
                >
                  Services
                </Link>
                <Link
                  href="/admin/gallery"
                  className={`${isActive('/admin/gallery')} px-3 py-2 rounded-md text-sm font-medium`}
                >
                  Gallery
                </Link>
                <Link
                  href="/admin/messages"
                  className={`${isActive('/admin/messages')} px-3 py-2 rounded-md text-sm font-medium`}
                >
                  Messages
                </Link>
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6">
              <button
                className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar; 