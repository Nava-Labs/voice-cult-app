"use client";

import Link from "next/link";
import { CryptoList } from "@/components/crypto-list";
import truncateEthAddress from "truncate-eth-address";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#1c1c1e] text-white p-4 space-y-4">
      <Link href="/create">
        <h1 className="text-3xl font-bold text-center">[start a new cult]</h1>
      </Link>

      <div className="bg-blue-700 p-2 text-center font-bold text-2xl">
        cult of retardio
      </div>

      <div className="bg-amber-600 p-4 space-y-2">
        <div className="flex items-center space-x-2">
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS5WA2PMXgXzQ2AS15kKDz9svzLx4BpvviP6w&s"
            alt="Jolik"
            className="w-12 h-12 rounded-full"
          />
          <div>
            <div className="flex items-center space-x-2">
              <span>Created by 🐸</span>
              <span className="text-green-500">
                {truncateEthAddress(
                  "0x4838b106fce9647bdf1e7877bf73ce8b0bad5f97",
                )}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-green-400">market cap: 29.14K</span>
            </div>
            <div className="font-bold">Joker Vitalik [ticker: JOLIK]:</div>
            <div className="text-sm">
              JolikCoin: Vitalik meets Joker in this chaotic Ethereum meme
              token. With 4.20 billion coins and features like the &quot;Arkham
              Asylum Vault,&quot; it aims to disrupt crypto while making you
              smile. Why so serious about finance?
            </div>
          </div>
        </div>
      </div>

      <div className="flex space-x-2">
        <input
          type="text"
          placeholder="search for token"
          className="flex-grow bg-[#8FBC8F] bg-opacity-20 p-2 rounded text-white placeholder-gray-300"
        />
        <button className="bg-[#8FBC8F] bg-opacity-20 px-4 py-2 rounded">
          search
        </button>
      </div>

      <CryptoList />
    </div>
  );
}
