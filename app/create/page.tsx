"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createClient } from "@supabase/supabase-js";
import Link from "next/link";
import { useState } from "react";
import { Form, useForm, useWatch } from "react-hook-form";
import { useAccount } from "wagmi";
import { FormControl, FormField, FormItem } from "../components/Form";

export default function CoinCreationForm() {
  const { address } = useAccount();
  //useForm
  const form = useForm({
    defaultValues: {
      name: "",
      ticker: "",
      description: "",
      image_url: "",
      airdrop_allocation: "",
    },
  });
  const name = useWatch({
    control: form.control,
    name: "name",
  });
  const ticker = useWatch({
    control: form.control,
    name: "ticker",
  });
  const description = useWatch({
    control: form.control,
    name: "description",
  });
  const imageUrl = useWatch({
    control: form.control,
    name: "image_url",
  });
  const airdropAllocation = useWatch({
    control: form.control,
    name: "airdrop_allocation",
  });

  const [isCreatingCult, setIsCreatingCult] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Initialize Supabase client
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY;
    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error("Missing Supabase environment variables");
    }
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    setIsCreatingCult(true);

    try {
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
    } finally {
      setIsCreatingCult(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(() => handleSubmit)}>
        <div className="min-h-screen text-white p-6 flex flex-col items-center">
          <div className="w-full max-w-md space-y-6">
            <Link href="/">
              <div className="text-2xl text-foreground font-bold text-center">
                [go back]
              </div>
            </Link>
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <label className="text-blue-700">name</label>
                    <FormControl>
                      <input
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
                name="ticker"
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
                name="description"
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
            </div>

            <Button
              className="w-full bg-blue-700 text-white text-base"
              disabled={isCreatingCult}
            >
              {isCreatingCult ? "Creating..." : "Create a cult"}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
