"use client";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import Link from "next/link";
import ConnectButton from "./ConnectButton";
import SignInWorldcoinButton from "./SignInWorldcoinButton";
import { useAccount } from "wagmi";
import { useSession } from "next-auth/react";
import truncateEthAddress from "truncate-eth-address";

export default function Headers() {
  const { address } = useAccount();
  const { data: session } = useSession();

  return (
    <div className="w-full px-4 py-3 top-0 border-b-[1px] border-neutral-600">
      <div className="flex flex-row justify-between items-center">
        <Link href="/" className="flex items-center">
          <h1 className="font-semibold text-2xl text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500">
            Voice Cult
          </h1>
        </Link>
        <div>
          {!address && !session ? (
            <Drawer>
              <DrawerTrigger>
                <Button>Login</Button>
              </DrawerTrigger>
              <DrawerContent>
                <DrawerHeader>
                  <DrawerTitle>Login to Voice Cult</DrawerTitle>
                  <DrawerDescription>
                    Connect your wallet and sign in with Worldcoin
                  </DrawerDescription>
                </DrawerHeader>
                <DrawerFooter>
                  <div className="flex flex-col items-center space-y-2">
                    <ConnectButton />
                    <SignInWorldcoinButton />
                  </div>
                </DrawerFooter>
              </DrawerContent>
            </Drawer>
          ) : (
            <Button>{address ? truncateEthAddress(address) : ""}</Button>
          )}
        </div>
      </div>
    </div>
  );
}
