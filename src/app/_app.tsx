import type { AppProps } from "next/app";
import Script from "next/script";
import "@/styles/globals.css";

function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Script
        strategy="beforeInteractive"
        src="https://meet.jit.si/external_api.js"
      />
      <Component {...pageProps} />
    </>
  );
}

export default App;
