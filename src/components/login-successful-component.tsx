"use client";

import Image from "next/image";

export default function LoginSuccessPage() {
  return (
    <div className="text-center">
      <div className="mb-5 flex items-center justify-center overflow-hidden">
        <Image
          alt="under maintenance"
          width={200}
          height={200}
          unoptimized
          src="/login-success/login-success.gif"
          className="w-[150px] h-[150px] lg:w-[200px] lg:h-[200px]"
        />
      </div>
      <h1 className="text-3xl md:text-4xl font-bold text-green-500 mb-4">
        Login Successful
      </h1>
      <p className="text-base md:text-lg text-gray-600 mb-8">
        Welcome back! You have successfully logged in.
      </p>

      <div className="text-sm text-gray-500">
        <p>Redirecting you to your dashboard...</p>
      </div>
    </div>
  );
}
