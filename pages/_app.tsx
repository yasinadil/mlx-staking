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
if (process.env.qnAPI != undefined) {
  providerLink = process.env.qnAPI;
}

const { chains, provider, webSocketProvider } = configureChains(
  [bsc],
  [
    jsonRpcProvider({
      rpc: (chain) => ({
        http: providerLink,
        // http: `https://white-fabled-glade.bsc.discover.quiknode.pro/${process.env.qnAPI}/`,
        // webSocket: `wss://white-fabled-glade.bsc.discover.quiknode.pro/${process.env.qnWssAPI}/`,
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
