import { getGroupedFiles } from "../find-files";
import { parseCode } from "./parse-code";
import { filterUnwanted } from "./filter-unwanted";

const ParseReactCode = async () => {
  const groupedReactFiles = await getGroupedFiles(`**/*.+(tsx|jsx|js|ts|mjs)`);

  const result = await parseCode(await filterUnwanted(groupedReactFiles));
};

export default ParseReactCode;
