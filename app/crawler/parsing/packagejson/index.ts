import { getGroupedFiles } from "../find-files";
import { parseJsonData } from "./parse-json-data";
import { readPackageJsons } from "./read-packagejsons";

const ParsePackageJsons = async () => {
  const groupedPackageFiles = await getGroupedFiles(`**/package.json`);
  const readJsons = await readPackageJsons(groupedPackageFiles);
  const parsedData = parseJsonData(readJsons);
  return parsedData;
};

export default ParsePackageJsons;
