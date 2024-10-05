"use client";

import { Button } from "@/components/ui/button";
import { ConnectKitButton } from "connectkit";
import truncateEthAddress from "truncate-eth-address";

export default function ConnectButton() {
  return (
    <ConnectKitButton.Custom>
      {({ isConnected, show, address }) => {
        return (
          <Button
            onClick={show}
            variant={"outline"}
            className="p-2 rounded-none bg-blue-700 hover:bg-blue-800 hover:text-white text-white w-28"
          >
            {isConnected
              ? truncateEthAddress(address as string)
              : "connect callet"}
          </Button>
        );
      }}
    </ConnectKitButton.Custom>
  );
}
