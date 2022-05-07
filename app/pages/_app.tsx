import Head from "next/head";
import "../styles/globals.css";

import Sidebar from "../components/Sidebar";

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <title>Dependency oversikt - NAV</title>
      </Head>
      <div className="flex bg-gray-100">
        {pageProps?.indexList && <Sidebar {...pageProps} />}
        <main>
          <Component {...pageProps} />
        </main>
      </div>
    </>
  );
}

export default MyApp;
