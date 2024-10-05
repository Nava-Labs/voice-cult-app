"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import {
  IDKitWidget,
  VerificationLevel,
  ISuccessResult,
} from "@worldcoin/idkit";
import { Button } from "@/components/ui/button";

export default function SignInWorldcoinButton() {
  const [isVerifying, setIsVerifying] = useState(false);
  const [verified, setVerified] = useState(false);

  const onSuccess = (result: ISuccessResult) => {
    setIsVerifying(true);
    // Call your API to verify the proof
    fetch("/api/verify-worldcoin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(result),
    })
      .then((response) => {
        setVerified(true);
        return response.json();
      })
      .then((data) => {
        console.log("response");
        if (data.success) {
          // If verification is successful, sign in with NextAuth
          signIn("worldcoin");
        } else {
          console.error("Verification failed:", data.error);
        }
      })
      .catch((error) => {
        console.error("Error during verification:", error);
      })
      .finally(() => {
        setIsVerifying(false);
      });
  };

  const handleVerify = async (proof: ISuccessResult) => {
    // This function is called when the proof is received
    // You can add additional client-side verification here if needed
    return true;
  };

  return (
    <IDKitWidget
      app_id="app_50f2d8f41e11d06d7a2ddd612f217916" // Replace with your actual app_id
      action="verify-with-worldcoin" // Replace with your actual action name
      onSuccess={(result) => onSuccess(result)}
      handleVerify={async (proof) => {
        await handleVerify(proof);
        // Return nothing (void)
      }}
      verification_level={VerificationLevel.Orb}
    >
      {({ open }) => (
        <Button
          onClick={open}
          disabled={isVerifying}
          variant={"outline"}
          className="p-2 rounded-none bg-amber-600 text-white hover:text-white w-28 hover:bg-amber-700"
        >
          {!isVerifying && !verified && (
            <div className="flex justify-center items-center">
              <div>Verify</div>
              <img
                src="/worldcoin-logo.png"
                className="h-3 ml-2"
                alt="Worldcoin logo"
              />
            </div>
          )}
          {isVerifying && "Verifying..."}
          {!isVerifying && verified && (
            <div className="flex justify-center items-center">
              <div>Verified</div>
              <img
                src="/worldcoin-logo.png"
                className="h-3 ml-2"
                alt="Worldcoin logo"
              />
            </div>
          )}
        </Button>
      )}
    </IDKitWidget>
  );
}
