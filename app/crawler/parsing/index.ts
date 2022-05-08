import ParsePackageJsons from "./packagejson";
import ParseReactCode from "./react";
import { writeData } from "./write-result";

const Parsing = async (date?: string) => {
  const packageJsonData = await ParsePackageJsons();
  const reactData = await ParseReactCode();
  writeData(
    JSON.stringify({ packagedata: packageJsonData, importData: reactData }),
    date
  );
  console.log("Finished PARSING-job");
};

export default Parsing;
