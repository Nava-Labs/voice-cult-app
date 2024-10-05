"use client";

import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";

export default function SignInWorldcoinButton() {
  return (
    <Button
      variant={"outline"}
      onClick={() => signIn("worldcoin")}
      className="p-2 rounded-none bg-amber-600 text-white w-40"
    >
      Sign in with Worldcoin
    </Button>
  );
}
