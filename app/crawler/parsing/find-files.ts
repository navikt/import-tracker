import fg from "fast-glob";
import { repoLocation } from "..";
import { readMetadata } from "../metadata";

export type GroupedFilesByRepoT = {
  name: string;
  last_update: Date | null;
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
  glob: string,
  root?: string
): Promise<GroupedFilesByRepoT[]> => {
  const directories = await getDirectories(root);
  const metadata = await readMetadata();

  const files: GroupedFilesByRepoT[] = [];

  for (const r of directories) {
    let repoFiles = await fg(
      [`${r}/${glob}`, "!**/node_modules/**", `!**/*.(spec|test).*`],
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
      last_update:
        metadata.repos.find(
          (x) => x.name === r.split(`${root ?? repoLocation}/`)[1]
        )?.pushed_at ?? null,
      files: repoFiles,
    });
  }

  console.log({
    "n-repo gjennomsøkt": directories.length,
    "n-files gjennomsøkt": files.reduce((old, n) => old + n.files.length, 0),
  });

  return files;
};
