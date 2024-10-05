import { useMemo } from "react";
import dataSource from "../utils/dataSource";
import { supportedChainID, SupportedChainID } from "../types/supportedChainID";
import { Chain } from "wagmi/chains";

const DEFAULT_CHAIN_ID = 534351;

type DataSourceKey = keyof typeof dataSource;

function useConfig(
  chain: Chain & {
    unsupported?: boolean;
  },
) {
  const defaultData = dataSource[DEFAULT_CHAIN_ID];

  const value: (typeof dataSource)[SupportedChainID] = useMemo(() => {
    if (!chain || chain.unsupported) return defaultData;

    const chainId = chain.id as DataSourceKey;
    if (!supportedChainID.includes(chainId)) return defaultData;

    return dataSource[chainId];
  }, [chain, defaultData]);

  return value;
}

export default useConfig;
