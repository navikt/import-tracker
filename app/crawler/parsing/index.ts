/* import { getGroupedFiles } from "./find-files"; */
import ParsePackageJsons from "./packagejson";

const Parsing = async () => {
  // const groupedJsFiles = await getGroupedFiles(`**/*.+(tsx|jsx|js|ts|mjs)`);
  const packagejsonData = await ParsePackageJsons();
  console.log("Finished PARSING-job");
};

export default Parsing;
