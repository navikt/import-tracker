import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html>
      <Head>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <link rel="icon" href="/favicon.png" sizes="any" type="image/png+xml" />
        {/* eslint-disable-next-line @next/next/no-title-in-document-head */}
        <title>Dependency oversikt - NAV</title>
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
