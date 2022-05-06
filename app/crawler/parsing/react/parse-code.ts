import { GroupedFilesByRepoT } from "../find-files";

export const parseCode = async (source: GroupedFilesByRepoT[]) => {
  try {
    return source;
  } catch (error) {
    return source;
  }
};
