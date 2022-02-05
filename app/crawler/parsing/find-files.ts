import fg from "fast-glob";
import { repoLocation } from "..";

export type GroupedFilesByRepoT = {
  name: string;
  source: string;
  files: string[];
};

export const getDirectories = (root?: string): Promise<string[]> =>
  fg(`${root ?? repoLocation}/*`, {
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

export const getGroupedFiles = async (
  root?: string
): Promise<GroupedFilesByRepoT[]> => {
  const directories = await getDirectories(root).then((r) => r.slice(0, 10));

  const files: GroupedFilesByRepoT[] = [];

  for (const r of directories) {
    let repoFiles = await fg(
      [
        `${r}/**/*.+(tsx|jsx|js|ts|mjs)`,
        "!**/node_modules/**",
        `!**/*.(spec|test).*`,
      ],
      {
        dot: true,
        concurrency: 5,
      }
    ).catch((e) => {
      throw new Error(e);
    });
    files.push({
      name: r.split(`${root ?? repoLocation}/`)[1],
      source: r,
      files: repoFiles,
    });
  }

  console.log({
    "n-repo": directories.length,
    "n-files": files.reduce((old, n) => old + n.files.length, 0),
  });

  return files;
};
