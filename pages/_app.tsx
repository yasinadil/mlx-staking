import "../styles/globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import type { AppProps } from "next/app";
import {
  RainbowKitProvider,
  getDefaultWallets,
  Theme,
} from "@rainbow-me/rainbowkit";
import { configureChains, createClient, WagmiConfig } from "wagmi";
import { bscTestnet } from "wagmi/chains";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";

//skilled-still-market.bsc-testnet.discover.quiknode.pro/43a1c3c2c004d25408dbdb7e8553325b67ab7188/

const { chains, provider, webSocketProvider } = configureChains(
  [bscTestnet],
  [
    jsonRpcProvider({
      rpc: (chain) => ({
        http: `https://skilled-still-market.bsc-testnet.discover.quiknode.pro/${process.env.qnAPI}/`,
        webSocket: `wss://skilled-still-market.bsc-testnet.discover.quiknode.pro/${process.env.qnAPI}/`,
      }),
    }),
  ]
);

const { connectors } = getDefaultWallets({
  appName: "Nox Platform",
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
