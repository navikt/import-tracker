import { getGroupedFiles } from "../find-files";
import { mapImports } from "./map-imports";
import { filterUnwanted } from "./filter-unwanted";
import { parseImportData } from "./parse-import-data";

const ParseReactCode = async () => {
  const imports = mapImports(await filterUnwanted());
  return parseImportData(imports);
};

export default ParseReactCode;
