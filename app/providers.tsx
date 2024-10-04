"use client";

import { WagmiProvider, createConfig } from "wagmi";
import { mantaTestnet, scrollSepolia } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConnectKitProvider, getDefaultConfig } from "connectkit";
import { SessionProvider } from "next-auth/react";

const config = createConfig(
  getDefaultConfig({
    // Your dApps chains
    chains: [scrollSepolia, mantaTestnet],
    // transports: {
    //   // RPC URL for each chain
    //   [mainnet.id]: http(
    //     `https://eth-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_ID}`,
    //   ),
    // },

    // Required API Keys
    walletConnectProjectId: "",

    // Required App Info
    appName: "Voice Cult",

    // Optional App Info
    appDescription: "",
    appUrl: "", // your app's url
    appIcon: "", // your app's icon, no bigger than 1024x1024px (max. 1MB)
  }),
);

const queryClient = new QueryClient();

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ConnectKitProvider>
          <SessionProvider>{children}</SessionProvider>
        </ConnectKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};
