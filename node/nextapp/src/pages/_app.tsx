import Head from "next/head";
import { AppProps } from "next/app";

export default function AppComponent({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>{pageProps.title}</title>
      </Head>
      <Component {...pageProps} />
    </>
  );
}
