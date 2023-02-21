import "../styles/globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import type { AppProps } from "next/app";
import {
  RainbowKitProvider,
  getDefaultWallets,
  Theme,
} from "@rainbow-me/rainbowkit";
import { configureChains, createClient, WagmiConfig } from "wagmi";
import { bsc } from "wagmi/chains";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";

let providerLink: string;
if (process.env.NEXT_PUBLIC_QN_API != undefined) {
  providerLink = process.env.NEXT_PUBLIC_QN_API;
}

const { chains, provider, webSocketProvider } = configureChains(
  [bsc],
  [
    jsonRpcProvider({
      rpc: (chain) => ({
        http: providerLink,
      }),
    }),
  ]
);

const { connectors } = getDefaultWallets({
  appName: "MLX Staking",
  chains,
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
  webSocketProvider,
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains}>
        <Component {...pageProps} />
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

export default MyApp;
