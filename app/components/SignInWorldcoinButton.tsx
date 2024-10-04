"use client";

import { signIn } from "next-auth/react";

export default function SignInWorldcoinButton() {
  return (
    <button
      onClick={() => signIn("worldcoin")}
      className="border rounded-lg p-2"
    >
      Sign in with Worldcoin
    </button>
  );
}
