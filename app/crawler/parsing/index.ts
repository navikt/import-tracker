/* import { getGroupedFiles } from "./find-files"; */
import ParsePackageJsons from "./packagejson";
import { writeData } from "./write-result";

const Parsing = async () => {
  // const groupedJsFiles = await getGroupedFiles(`**/*.+(tsx|jsx|js|ts|mjs)`);
  const packageJsonData = await ParsePackageJsons();
  writeData(packageJsonData);
  console.log("Finished PARSING-job");
};

export default Parsing;
