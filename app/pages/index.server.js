import React, { Suspense } from "react";
import Header from "../components/Header.client";
import PackageList from "../components/PackageList.server";
import Dataview from "../components/Dataview.server";
import { replacer, reviver } from "../crawler/parsing/map-to-json";
const { readFileSync, readdirSync } = require("fs");

export const files = [];

const getFiles = () => {
  const fileNames = readdirSync("public/data").reverse();
  for (const fileName of fileNames) {
    const file = readFileSync(`public/data/${fileName}`, "utf8");
    files.push({
      name: fileName,
      data: JSON.parse(file),
    });
  }
};

export default function Home({ ...rest }) {
  if (!files.length > 0) getFiles();

  const filter = (data) => {
    const str = JSON.stringify(data);
    const map = JSON.parse(str, reviver);

    return JSON.stringify(
      new Map(
        [...map].filter(([key]) =>
          rest?.searchTags.find((x) => key.includes(x))
        )
      ),
      replacer
    );
  };

  const pickKey = (obj) => {
    const map = {
      all: "packages",
      dep: "packagesDeps",
      dev: "packagesDevDeps",
      peer: "packagesPeerDeps",
      trend: "packages",
    };
    return obj[map[rest?.selectedFilter ?? "all"]];
  };

  const pickedFile = rest.selectedFile
    ? files.find((x) => x.name === rest.selectedFile)
    : files[0];

  const data =
    rest.searchTags && rest.searchTags.length > 0
      ? filter(pickKey(pickedFile.data))
      : JSON.stringify(pickKey(pickedFile.data));

  return (
    <div className="bg-gray-50">
      <Header {...rest} />
      <div className="flex w-full items-center">
        <Suspense fallback={"Loading..."}>
          <PackageList
            data={data}
            options={files.map((x) => x.name)}
            original={JSON.stringify(pickKey(pickedFile.data))}
            {...rest}
          />
          <Dataview
            data={JSON.stringify(pickedFile.data.packages)}
            fileName={pickedFile.name}
            {...rest}
          />
        </Suspense>
      </div>
    </div>
  );
}

/* export async function getServerSideProps(context) {
  const { readFileSync, readdirSync } = require("fs");
  const fileNames = readdirSync("public/data").reverse();

  const files = [];
  for (const fileName of fileNames) {
    const file = readFileSync(`public/data/${fileName}`, "utf8");
    files.push({
      name: fileName,
      data: JSON.parse(file),
    });
  }

  return {
    props: { files },
  };
}
 */
