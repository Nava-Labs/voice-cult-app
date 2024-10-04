"use client";

import Link from "next/link";
import React from "react";
import ConnectButton from "./ConnectButton";

export default function Headers() {
  return (
    <div className="w-full px-4 py-3 top-0 border-b-[1px] border-neutral-600">
      <div className="flex flex-row justify-between items-center">
        <Link href="/" className="flex items-center">
          <h1 className="font-semibold text-2xl text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500">
            Voice Cult
          </h1>
        </Link>
        <div>
          <ConnectButton />
        </div>
      </div>
    </div>
  );
}
