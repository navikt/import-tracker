import fg from "fast-glob";
import { repoLocation } from "..";

type GroupedFilesByRepoT = {
  name: string;
  source: string;
  files: string[];
};

const getDirectories = (): Promise<string[]> =>
  fg(`${repoLocation}/*`, {
    onlyFiles: false,
    deep: 1,
    onlyDirectories: true,
    concurrency: 5,
  })
    .then((dirs) => {
      if (dirs.length === 0)
        throw new Error(
          "Could not find any repos to read from - find-files.ts"
        );
      return dirs;
    })
    .catch((e) => {
      throw new Error(e);
    });

export const getGroupedFiles = async (): Promise<GroupedFilesByRepoT[]> => {
  const directories = await getDirectories();

  const files: GroupedFilesByRepoT[] = [];

  for (const r of directories) {
    let repoFiles = await fg(
      [`${r}/**/*.+(tsx|jsx|js|ts|mjs)`, "!**/node_modules/**"],
      {
        dot: true,
        concurrency: 5,
      }
    ).catch((e) => {
      throw new Error(e);
    });
    files.push({
      name: r.split(`${repoLocation}/`)[1],
      source: r,
      files: repoFiles,
    });
  }
  return files;
};
