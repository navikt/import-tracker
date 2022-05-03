import { getGroupedFiles } from "../find-files";
import { readPackageJsons } from "./read-packagejsons";

const ParsePackageJsons = async () => {
  const groupedPackageFiles = await getGroupedFiles(`**/package.json`);
  const readJsons = await readPackageJsons(groupedPackageFiles);
  return readJsons;
};

export default ParsePackageJsons;