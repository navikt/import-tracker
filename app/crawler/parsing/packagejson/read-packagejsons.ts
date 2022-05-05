import fs from "fs";
import { GroupedFilesByRepoT } from "../find-files";

export type PackageJsonT = {
  dependencies?: { [key: string]: string };
  devDependencies?: { [key: string]: string };
  peerDependencies?: { [key: string]: string };
};

export type GroupedPackagesByRepoT = {
  name: string;
  source: string;
  last_update: Date | null;
  files: PackageJsonT[];
};

export const readPackageJsons = async (
  repos: GroupedFilesByRepoT[]
): Promise<GroupedPackagesByRepoT[]> => {
  const res = [];

  for (const repo of repos) {
    res.push({
      ...repo,
      files: await Promise.all(
        repo.files.map((file) => readPackageJsonFile(file))
      ),
    });
  }

  return filterPackageJsons(res);
};

export const readPackageJsonFile = (path: string) =>
  new Promise<PackageJsonT | null>((resolve, reject) =>
    fs.readFile(path, (e, data) =>
      e ? reject(null) : resolve(JSON.parse(data.toString()))
    )
  );

export const filterPackageJsons = (data: GroupedPackagesByRepoT[]) =>
  data.map((x) => ({
    ...x,
    files: x.files.map(
      ({ dependencies, devDependencies, peerDependencies }) => ({
        dependencies,
        devDependencies,
        peerDependencies,
      })
    ),
  }));
