"use client";

import Link from "next/link";
import ConnectButton from "./ConnectButton";
import SignInWorldcoinButton from "./SignInWorldcoinButton";

export default function Headers() {
  return (
    <div className="w-full px-4 py-3 top-0 border-b-[1px] border-neutral-600">
      <div className="flex flex-row justify-between items-center">
        <Link href="/" className="flex items-center">
          <h1 className="font-semibold text-2xl text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-orange-600 to-green-600">
            voice cult
          </h1>
        </Link>
        <div>
          <ConnectButton />
          <SignInWorldcoinButton />
        </div>
      </div>
    </div>
  );
}
