import { files, getFiles } from "./get-pages";

export const getVersions = (name: string) => {
  if (!files) getFiles();
  const pack = files[0].data.packages.get(name);
  if (!pack) return [];

  const sorted = new Map(
    [...pack.versions].sort((a, b) => {
      return b[1].length - a[1].length;
    })
  );

  return [...sorted.entries()].map(([x, val], y) => ({
    version: x,
    n: val.filter((value, index, array) => array.indexOf(value) === index)
      .length,
    repos: val.filter((value, index, array) => array.indexOf(value) === index),
  }));
};
