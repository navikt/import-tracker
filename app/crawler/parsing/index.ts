import ParsePackageJsons from "./packagejson";
import ParseReactCode from "./react";
import { writeData } from "./write-result";

const Parsing = async (date?: string) => {
  /* const packageJsonData = await ParsePackageJsons();
  writeData(packageJsonData, date); */
  const reactData = await ParseReactCode();
  console.log("Finished PARSING-job");
};

export default Parsing;
