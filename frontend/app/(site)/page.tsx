'use client';

import Image from "next/image";
import AuthForm from "@/components/auth-form";
import React from "react";
import { useState } from "react";
import logo from '@/public/logo.png'

export default function AuthPage() {
    const [message, setMessage] = useState("Login to your account!");

    const handleRegisterClick = (currentVariant: string) => {
        if (currentVariant === 'LOGIN') {
          setMessage("Create your account!");
        } else {
          setMessage("Login to your account!");
        }
      };

    return (
        <div className="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <Image
                    alt="Logo"
                    height="120"
                    width="120"
                    className="mx-auto w-auto"
                    src={logo}
                />
                <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
                    {message}
                </h2>
            </div>
            <AuthForm onRegisterClick={handleRegisterClick} />
        </div>
    );
}