import React from "react";
import { getIndexedList } from "../lib/get-data";
import { Card } from "./package/[name]";

export default function Home({ ...rest }) {
  return (
    <div className="flex max-h-screen min-h-screen w-full flex-col gap-6 overflow-auto p-12">
      <div className="flex max-w-2xl flex-wrap gap-4">
        {/* <Card></Card> */}
      </div>
    </div>
  );
}

export async function getStaticProps() {
  return {
    props: {},
  };
}
