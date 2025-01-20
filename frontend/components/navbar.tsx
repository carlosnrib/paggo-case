"use client";

import logo from '@/public/logo.png'
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { signOut } from 'next-auth/react';

const Navbar: React.FC = () => {
    return (
        <nav className="flex justify-between items-center py-4 px-6 border border-b-gray-200 ">
            <Image alt="Logo" height="64" width="64" src={logo} />
            <Button 
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
                onClick={() => signOut({ callbackUrl: '/' })}
            >
                Logout
            </Button>
        </nav>
    );
};

export default Navbar;