import { files, getFiles } from "./get-pages";

export const getRepos = (): number => {
  if (!files) getFiles();
  const packages = files[0].data.packages;

  console.log(files[0]);

  const repos = new Set();

  [...packages.entries()].forEach(([x, val], y) => {
    [...val.versions.values()].forEach((x) => x.forEach((y) => repos.add(y)));
  });

  return repos.size;
};
