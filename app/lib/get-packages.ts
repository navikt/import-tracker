import { files, getFiles, getPages } from "./get-pages";

export const getPackages = (): number => {
  if (!files) getFiles();

  return files[0].data.packages.size;
};

export const getScope = (): number => {
  if (!files) getFiles();

  return [...files[0].data.packages.keys()].filter((x) =>
    x.startsWith("@navikt/")
  ).length;
};

export const getDeprecated = (): number => {
  if (!files) getFiles();

  return getPages().filter(
    (x) => ![...files[0].data.packages.keys()].includes(x)
  ).length;
};
