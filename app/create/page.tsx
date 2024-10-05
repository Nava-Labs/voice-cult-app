"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";

export default function CoinCreationForm() {
  return (
    <div className="min-h-screen text-white p-6 flex flex-col items-center">
      <div className="w-full max-w-md space-y-6">
        <Link href="/">
          <div className="text-2xl text-foreground font-bold text-center">
            [go back]
          </div>
        </Link>

        <div className="space-y-4">
          <div>
            <Label htmlFor="name" className="text-blue-700">
              name
            </Label>
            <Input
              id="name"
              className="border border-foreground text-foreground rounded-none"
            />
          </div>

          <div>
            <Label htmlFor="ticker" className="text-amber-600">
              ticker
            </Label>
            <Input
              id="ticker"
              className="border-foreground text-foreground rounded-none"
            />
          </div>

          <div>
            <Label htmlFor="description" className="text-green-600">
              description
            </Label>
            <Textarea
              id="description"
              className="border-foreground text-foreground rounded-none"
            />
          </div>

          <div>
            <Label htmlFor="image" className="text-yellow-500">
              image
            </Label>
            <div className="flex items-center border border-foreground">
              <label
                htmlFor="file-upload"
                className="cursor-pointer bg-neutral-200 text-foreground py-2 px-4"
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

        <Button className="w-full bg-blue-700 text-white text-base">
          create a cult
        </Button>
      </div>
    </div>
  );
}
