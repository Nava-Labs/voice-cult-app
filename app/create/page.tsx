"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createClient } from "@supabase/supabase-js";
import Link from "next/link";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import {
  useAccount,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { Form, FormControl, FormField, FormItem } from "../components/Form";
import { useRouter } from "next/navigation";
import useConfig from "@/shared/hooks/useConfig";
import { VC_TOKEN_DEPLOYER_ABI } from "@/lib/abis/vc-token-deployer.abi";

export default function CoinCreationForm() {
  const router = useRouter();
  const { address, chain } = useAccount();
  const { data: hash, writeContract } = useWriteContract();
  const { isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    confirmations: 5,
    hash,
  });

  const { VC_TOKEN_DEPLOYER } = useConfig(chain!);

  const [isCreatingCult, setIsCreatingCult] = useState(false);

  //useForm
  const form = useForm();
  const name = useWatch({
    control: form.control,
    name: "_name",
  });
  const ticker = useWatch({
    control: form.control,
    name: "_ticker",
  });
  const description = useWatch({
    control: form.control,
    name: "_description",
  });
  const imageUrl = useWatch({
    control: form.control,
    name: "image_url",
  });
  const airdropAllocation = useWatch({
    control: form.control,
    name: "airdrop_allocation",
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Initialize Supabase client
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceRoleKey =
      process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY;
    if (!supabaseUrl || !supabaseServiceRoleKey) {
      throw new Error("Missing Supabase environment variables");
    }
    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

    setIsCreatingCult(true);
    try {
      writeContract({
        address: VC_TOKEN_DEPLOYER,
        abi: VC_TOKEN_DEPLOYER_ABI,
        functionName: "createVc",
        args: [
          name,
          ticker,
          "",
          BigInt("1000000000000000000000000000"),
          BigInt(0),
          "0xfbF4b007958B9419CC6a714aCF5561840154FA54",
          "0xfbF4b007958B9419CC6a714aCF5561840154FA54",
          false,
          BigInt(0),
        ],
        value: BigInt(0),
      });

      await supabase.from("projects").insert({
        user_address: address,
        token_address: address,
        token_details: {
          name: name,
          symbol: ticker,
          image_url: imageUrl,
          description: description,
          airdrop_allocation: airdropAllocation,
        },
        total_points_allocated: 0,
      });
    } catch (error) {
      console.error("Error creating cult:", error);
    } finally {
      setIsCreatingCult(false);
    }
  };

  return (
    <Form {...form}>
      <div className="min-h-screen text-white p-6 flex flex-col items-center">
        <div className="w-full max-w-md space-y-6">
          <Link href="/">
            <div className="text-2xl text-foreground font-bold text-center">
              [go back]
            </div>
          </Link>
          <form onSubmit={handleSubmit} className="scroll-py-4">
            <FormField
              control={form.control}
              name="_name"
              render={({ field }) => (
                <FormItem>
                  <label className="text-blue-700">name</label>
                  <FormControl>
                    <Input
                      {...field}
                      required
                      type="text"
                      className="border border-foreground text-foreground rounded-none"
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="_ticker"
              render={({ field }) => (
                <FormItem>
                  <label className="text-blue-700">ticker</label>
                  <FormControl>
                    <Input
                      {...field}
                      required
                      type="text"
                      className="border border-foreground text-foreground rounded-none"
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="_description"
              render={({ field }) => (
                <FormItem>
                  <label className="text-blue-700">description</label>
                  <FormControl>
                    <Textarea
                      {...field}
                      required
                      className="border border-foreground text-foreground rounded-none"
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="image_url"
              render={({ field }) => (
                <FormItem>
                  <label className="text-blue-700">image</label>
                  <FormControl>
                    <Input
                      {...field}
                      required
                      type="text"
                      className="border border-foreground text-foreground rounded-none"
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="airdrop_allocation"
              render={({ field }) => (
                <FormItem>
                  <label className="text-blue-700">airdrop allocation</label>
                  <FormControl>
                    <Input
                      {...field}
                      required
                      type="text"
                      className="border border-foreground text-foreground rounded-none"
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <Button
              className="mt-3 w-full bg-blue-700 text-white text-base"
              disabled={isCreatingCult}
              type="submit"
            >
              {isCreatingCult ? "Creating..." : "Create a cult"}
            </Button>
          </form>
        </div>
      </div>
    </Form>
  );
}
