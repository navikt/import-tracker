import React, { Suspense } from "react";
import Header from "../components/Header.client";
import PackageList from "../components/PackageList.server";
import { replacer, reviver } from "../crawler/parsing/map-to-json";

export default function Home({ jsonData, ...rest }) {
  const filter = (data) => {
    const str = JSON.stringify(data);
    const map = JSON.parse(str, reviver);

    return JSON.stringify(
      new Map([...map].filter(([key, val]) => key.includes(rest.searchText))),
      replacer
    );
  };

  const data = rest.searchText
    ? filter(jsonData.packages)
    : JSON.stringify(jsonData.packages);

  return (
    <div className="bg-gray-50">
      <Header />
      <div className="flex w-full">
        <Suspense fallback={"Loading..."}>
          <PackageList data={data} {...rest} />
        </Suspense>
      </div>
    </div>
  );
}

export async function getServerSideProps(context) {
  const { readFileSync } = require("fs");
  const jsonData = readFileSync("public/data/result.json");

  return {
    props: { jsonData: JSON.parse(jsonData) },
  };
}
