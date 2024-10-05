"use client";

import { useState } from 'react';
import { signIn } from "next-auth/react";
import { IDKitWidget, VerificationLevel, ISuccessResult } from '@worldcoin/idkit'

export default function SignInWorldcoinButton() {
  const [isVerifying, setIsVerifying] = useState(false);

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
      .then((response) => response.json())
      .then((data) => {
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
      app_id="app_staging_d6a5e2a0a8a5b5a5e2a0a8a5b5a5e2a0" // Replace with your actual app_id
      action="your-action-name" // Replace with your actual action name
      onSuccess={(result) => onSuccess(result)}
      handleVerify={async (proof) => {
        await handleVerify(proof);
        // Return nothing (void)
      }}
      verification_level={VerificationLevel.Orb}
    >
      {({ open }) => (
        <button 
          onClick={open}
          disabled={isVerifying}
          className="p-2 rounded-none bg-amber-600 text-white w-40 hover:bg-amber-700"
        >
          {isVerifying ? "Verifying..." : "Verify with World ID"}
        </button>
      )}
    </IDKitWidget>
  );
}
