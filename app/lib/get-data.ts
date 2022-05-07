import { files, getFiles, getPages } from "./get-pages";

let indexedList;

const packageList = (
  key?: "packagesDeps" | "packagesDevDeps" | "packagesPeerDeps"
) => {
  if (!files) getFiles();

  const dataKey = key ? key : "packages";
  const current = new Map(
    [...files[0].data[dataKey]].sort((a, b) => {
      return b[1].counter - a[1].counter;
    })
  );

  const indexed = [...current.keys()].map((x, y) => ({ index: y, name: x }));

  const old = getPages(key)
    .filter((x) => ![...current.keys()].includes(x))
    .map((x) => ({ index: null, name: x }));

  return [...indexed, ...old];
};

const generateIndex = () => {
  indexedList = {
    all: packageList(),
    dep: packageList("packagesDeps"),
    dev: packageList("packagesDevDeps"),
    peer: packageList("packagesPeerDeps"),
  };
};

export const getIndexedList = () => {
  if (!indexedList) generateIndex();
  return indexedList;
};
