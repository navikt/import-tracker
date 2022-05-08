import { readdirSync, readFileSync } from "fs";
import { replacer, reviver } from "../crawler/parsing/map-to-json";
import { PackageJsonResults } from "../crawler/parsing/packagejson/parse-json-data";
import { ImportSummaryT } from "../crawler/parsing/react/parse-import-data";

export let files: {
  name: string;
  data: PackageJsonResults;
  importData: ImportSummaryT[];
}[];

export const getFiles = () => {
  files = [];
  const fileNames = readdirSync("public/data").reverse();
  for (const fileName of fileNames) {
    const file = readFileSync(`public/data/${fileName}`, "utf8");
    files.push({
      name: fileName,
      data: JSON.parse(file, reviver)?.packagedata ?? JSON.parse(file, reviver),
      importData: JSON.parse(file, reviver)?.importData,
    });
  }
};

export const getPages = (
  key?: "packagesDeps" | "packagesDevDeps" | "packagesPeerDeps"
): string[] => {
  if (!files) getFiles();
  const dataKey = key ? key : "packages";

  const packSet = new Set<string>();

  files.forEach((x) =>
    [...x.data[dataKey].keys()].forEach((x) => packSet.add(x))
  );

  return [...packSet.keys()];
};
