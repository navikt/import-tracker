import { packageT } from "./imports-stats";
const uniq = require("lodash.sorteduniq");
import glob from "fast-glob";
const fs = require("fs");

interface packageUsageT {
  name: string;
  repos: packageUsageInReposT[];
}

interface packageUsageInReposT {
  repo: string;
  versions: (packageInRepoT | null)[];
}

interface packageInRepoT {
  version: string;
  file: string;
}

const findDependenies = (json: any, packageName: string) => {
  const deps = {
    ...json["peerDependencies"],
    ...json["devDependencies"],
    ...json["dependencies"],
  };

  return packageName in deps ? deps[packageName] : null;
};

const parseRepos = (
  repos: string[],
  packageName: string
): Promise<packageUsageInReposT[]> => {
  return new Promise((resolve, reject) => {
    const parsed = repos.map((repo) => {
      let packageJsons = glob.sync(`./repos/${repo}/**/package.json`, {
        dot: true,
      });

      const parsedJson: (packageInRepoT | null)[] = packageJsons.map((pack) => {
        let json = JSON.parse(fs.readFileSync(pack));
        const version = findDependenies(json, packageName);
        return !!version
          ? { version: version as string, file: pack.replace("./repos/", "") }
          : null;
      });

      return {
        repo,
        versions: parsedJson.filter((x) => !!x),
      };
    });
    resolve(parsed);
  });
};
/**
 * Finds the repos using each package and what version
 * @param string[]
 * @param packageT
 * @returns packageUsageT[]
 */
export const getPackageUsage = async (packages: string[], data: packageT) => {
  console.log("Starting check of package versions");
  const packageData: packageUsageT[] = [];
  await packages.forEach(async (pack) => {
    if (pack in data) {
      let repos = uniq(data[pack].fileSource.map((x) => x.split("/")[0]));
      packageData.push({ name: pack, repos: await parseRepos(repos, pack) });
    }
  });

  console.log("Finished check of package versions");

  return packageData;
};
