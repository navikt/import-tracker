import { getGroupedFiles } from "../find-files";
import { stringify } from "../map-to-json";
import { parseJsonData } from "./parse-json-data";
import { readPackageJsons } from "./read-packagejsons";

const ParsePackageJsons = async () => {
  const groupedPackageFiles = await getGroupedFiles(`**/package.json`);
  const readJsons = await readPackageJsons(groupedPackageFiles);
  return stringify(parseJsonData(readJsons));
};

export default ParsePackageJsons;
