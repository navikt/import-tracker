import { getGroupedFiles } from "./find-files";

const Parsing = async () => {
  const grouped = await getGroupedFiles();
  console.log("Finished PARSING-job");
};

export default Parsing;
