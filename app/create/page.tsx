"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export default function CoinCreationForm() {
  const [showMoreOptions, setShowMoreOptions] = useState(false);

  return (
    <div className="min-h-screen bg-[#1c1c1e] text-white p-6 flex flex-col items-center">
      <div className="w-full max-w-md space-y-6">
        <Link href="/">
          <div className="text-2xl font-bold text-center">[go back]</div>
        </Link>

        <div className="space-y-4">
          <div>
            <Label htmlFor="name" className="text-[#4a9eff]">
              name
            </Label>
            <Input
              id="name"
              className="bg-[#2c2c30] border-[#3a3a3e] text-white"
            />
          </div>

          <div>
            <Label htmlFor="ticker" className="text-[#4a9eff]">
              ticker
            </Label>
            <Input
              id="ticker"
              className="bg-[#2c2c30] border-[#3a3a3e] text-white"
            />
          </div>

          <div>
            <Label htmlFor="description" className="text-[#4a9eff]">
              description
            </Label>
            <Textarea
              id="description"
              className="bg-[#2c2c30] border-[#3a3a3e] text-white"
            />
          </div>

          <div>
            <Label htmlFor="image" className="text-[#4a9eff]">
              image
            </Label>
            <div className="flex items-center bg-[#2c2c30] border border-[#3a3a3e] rounded-md">
              <label
                htmlFor="file-upload"
                className="cursor-pointer bg-[#3a3a3e] text-white py-2 px-4 rounded-l-md hover:bg-[#4a4a4e]"
              >
                Choose File
              </label>
              <input id="file-upload" type="file" className="hidden" />
              <span className="flex-grow p-2 text-gray-400">
                No file chosen
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={() => setShowMoreOptions(!showMoreOptions)}
          className="flex items-center text-[#4a9eff] hover:underline"
        >
          Show more options{" "}
          <ChevronDown
            className={`ml-1 transform ${showMoreOptions ? "rotate-180" : ""} transition-transform`}
          />
        </button>

        <Button className="w-full bg-[#4a9eff] hover:bg-[#3a8eff] text-white">
          Create coin
        </Button>

        <p className="text-sm text-center text-gray-400">
          When your coin completes its bonding curve you receive 0.5 SOL
        </p>
      </div>
    </div>
  );
}
