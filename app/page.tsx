"use client";

import Link from "next/link";
import { CryptoList } from "@/components/crypto-list";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#1c1c1e] text-white p-4 space-y-4">
      <Link href="/create">
        <h1 className="text-3xl font-bold text-center">[start a new cult]</h1>
      </Link>

      <div className="bg-gradient-to-r from-yellow-500 to-orange-500 p-2 rounded text-center font-bold text-2xl">
        Cult of retardio
      </div>

      <div className="bg-gray-800 p-4 rounded-lg space-y-2">
        <div className="flex items-center space-x-2">
          <img
            src="/placeholder.svg?height=50&width=50"
            alt="RGB Token"
            className="w-12 h-12 rounded"
          />
          <div>
            <div className="flex items-center space-x-2">
              <span>Created by 🐸</span>
              <span className="text-blue-400">8nFKRR</span>
              <span className="text-gray-400">6m ago</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-green-400">market cap: 29.14K</span>
              <span>[badge:👑]</span>
            </div>
            <div>replies: 1</div>
            <div className="font-bold">RGB [ticker: RGB]</div>
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
