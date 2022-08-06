import "../styles/globals.css";
import type { AppProps } from "next/app";
import { getDefaultProvider } from "ethers";
import { WagmiConfig, createClient } from "wagmi";
import { SessionProvider } from "next-auth/react";
import Layout from "../components/Layout";

const client = createClient({
  autoConnect: false,
  provider: getDefaultProvider(),
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <WagmiConfig client={client}>
      <SessionProvider session={pageProps.session} refetchInterval={0}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </SessionProvider>
    </WagmiConfig>
  );
}

export default MyApp;
