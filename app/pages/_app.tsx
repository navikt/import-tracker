import Head from "next/head";
import "../styles/globals.css";
import { useRouter } from "next/router";

import Sidebar from "../components/Sidebar";
import DsSidebar from "../components/DsSidebar";

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  return (
    <>
      <Head>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <title>Dependency oversikt - NAV</title>
      </Head>
      <div className="flex bg-gray-100">
        {router.asPath.startsWith("/ds") ? (
          <DsSidebar />
        ) : (
          <Sidebar {...pageProps} />
        )}
        <main className="w-full">
          <Component {...pageProps} />
        </main>
      </div>
    </>
  );
}

export default MyApp;
