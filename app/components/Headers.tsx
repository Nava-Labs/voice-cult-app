"use client";

import Link from "next/link";
import React from "react";
import ConnectButton from "./ConnectButton";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import SignInWorldcoinButton from "./SignInWorldcoinButton";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

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

          {/* <Dialog>
            <DialogTrigger>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Login to Voice Cult</DialogTitle>
                <DialogDescription>
                  Connect your wallet and sign in with Worldcoin
                </DialogDescription>
              </DialogHeader>
              <ConnectButton />
              <SignInWorldcoinButton />
            </DialogContent>
          </Dialog> */}
        </div>
      </div>
    </div>
  );
}
