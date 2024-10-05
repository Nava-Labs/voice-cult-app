export const supportedChainID = [
  534351, // Scroll Sepolia
  3441006, // Manta Testnet
] as const;
export type SupportedChainID = (typeof supportedChainID)[number];
