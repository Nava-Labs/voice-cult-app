"use client";

import { useCallback, useRef, useState } from "react";
import { Copy, ChevronDown, Mic } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Coin } from "../components/coin/Coin";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";

export default function ProjectDetails() {
  const [amount, setAmount] = useState("0.0");

  const accumulatedPoints = useRef(0);
  const currentBatteryWithRef = useRef(0);

  const [isTapping, setIsTapping] = useState(false);
  const [displayedPoints, setDisplayedPoints] = useState(0);
  const [currentBattery, setCurrentBattery] = useState(1000);

  const handleClick = useCallback(() => {
    const clickValue = 1;
    setIsTapping(true);
    // farmDetails!.current_settled_point += clickValue;
    setDisplayedPoints((prev) => prev + clickValue);
    accumulatedPoints.current += clickValue;
    setCurrentBattery((prev) => Math.max(1, prev - clickValue));
    // debouncedAddPoints();
  }, []);

  return (
    <Tabs defaultValue="tap">
      <div className="flex flex-col min-h-screen bg-gray-900 text-gray-100">
        <TabsContent
          value="tap"
          className="flex flex-col items-center justify-center flex-grow overflow-hidden"
        >
          <div className="flex flex-col items-center">
            <div className="flex items-center space-x-1">
              <h1 className="text-4xl sm:text-5xl">{displayedPoints}</h1>
            </div>
          </div>

          <div className="pt-6 sm:pt-10 mb-6 sm:mb-8 flex justify-center">
            <div className="flex items-center justify-center space-x-2">
              <span className="text-lg sm:text-xl font-bold">1000/1000</span>
            </div>
          </div>
          <div className="flex justify-center">
            <Coin
              canIClickPlease={true}
              sleep={false}
              funMode={true}
              clickValue={1}
              cooldown={1}
              handleClick={handleClick}
            />
          </div>

          <div className="w-full px-4 mt-4">
            <Progress value={currentBattery} className="w-full" />
          </div>

          <div className="w-full px-4 mt-8 flex flex-col items-center">
            <Button className="w-32 h-32 rounded-full flex flex-col items-center justify-center">
              <Mic className="h-12 w-12 mb-2" />
              <span className="text-sm">Cult Chant</span>
            </Button>
          </div>
        </TabsContent>

        <TabsContent
          value="trade"
          className="overflow-y-auto overflow-x-hidden flex-grow"
        >
          <div className="p-4">
            <div className="bg-lime-400 text-black p-2 rounded-lg mb-4 flex items-center text-sm sm:text-base">
              <span className="bg-gray-200 p-1 rounded mr-2">👤</span>
              F6GpDg bought 0.0250 SOL of JOJOY
              <span className="ml-auto">🐶</span>
            </div>

            <div className="mb-4">
              <h2 className="text-green-400 text-base sm:text-lg">
                Market cap: $4,278,531
              </h2>
              <div className="flex items-center bg-gray-800 rounded p-2 mt-2">
                <span className="mr-2">CA:</span>
                <span className="flex-1 truncate text-xs sm:text-sm">
                  J4ze9anpDctWrb5yFjedpTdqznD76FVPgCh
                </span>
                <Button variant="ghost" size="icon">
                  <Copy className="h-4 w-4" />
                  <span className="sr-only">Copy</span>
                </Button>
              </div>
            </div>

            <Card>
              <CardContent className="p-4">
                <div className="grid grid-cols-2 gap-2 sm:gap-4 mb-4">
                  <Button className="bg-green-500 hover:bg-green-600 text-sm sm:text-base">
                    Buy
                  </Button>
                  <Button variant="outline" className="text-sm sm:text-base">
                    Sell
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-2 sm:gap-4 mb-4">
                  <Button variant="outline" className="text-xs sm:text-sm">
                    switch to Monchhichi
                  </Button>
                  <Button variant="outline" className="text-xs sm:text-sm">
                    Set max slippage
                  </Button>
                </div>
                <div className="relative mb-4">
                  <Input
                    type="text"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="pr-16 text-sm sm:text-base"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 text-sm sm:text-base">
                    SOL <ChevronDown className="ml-1 h-4 w-4" />
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setAmount("0.0")}
                    className="text-xs sm:text-sm"
                  >
                    reset
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setAmount("0.1")}
                    className="text-xs sm:text-sm"
                  >
                    0.1 SOL
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setAmount("0.5")}
                    className="text-xs sm:text-sm"
                  >
                    0.5 SOL
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setAmount("1")}
                    className="text-xs sm:text-sm"
                  >
                    1 SOL
                  </Button>
                </div>
                <Button className="w-full bg-green-500 hover:bg-green-600 text-sm sm:text-base">
                  place trade
                </Button>
                <Button
                  variant="link"
                  className="w-full mt-2 text-sm sm:text-base"
                >
                  add comment
                </Button>
              </CardContent>
            </Card>

            <div className="mt-4">
              <h3 className="text-base sm:text-lg font-semibold mb-2">
                Thread
              </h3>
              <div className="space-y-4">
                <div className="bg-gray-800 p-3 sm:p-4 rounded">
                  <div className="flex items-center mb-2">
                    <span className="bg-green-500 text-black px-2 py-1 rounded mr-2 text-xs sm:text-sm">
                      3se2pQ (dev)
                    </span>
                    <span className="text-gray-400 text-xs sm:text-sm">
                      10/4/2024, 10:28:37 PM
                    </span>
                  </div>
                  <p className="text-sm sm:text-base">
                    Monchhichi (ticker: Monchhichi) Monchhichi (モンチッチ,
                    Monchitchi) is a line of Japanese stuffed monkey toys from
                    the Sekiguchi Corporation, first released in 1974. They were
                    licensed by Mattel in the United States until 1985, and
                    later distributed worldwide directly by Sekiguchi.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <footer className="bg-gray-800 p-2 sticky bottom-0">
          <TabsList className="sticky bottom-0 w-full">
            <TabsTrigger value="tap" className="w-full">
              Tap
            </TabsTrigger>
            <TabsTrigger value="trade" className="w-full">
              Trade
            </TabsTrigger>
          </TabsList>
        </footer>
      </div>
    </Tabs>
  );
}
