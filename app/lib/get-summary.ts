import { ImportSummaryT } from "../crawler/parsing/react/parse-import-data";
import { files, getFiles } from "./get-pages";

export const getSummary = (name: string): ImportSummaryT => {
  if (!files) getFiles();
  return files[0].importData.find((x) => x.name === name);
};
