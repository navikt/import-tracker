import simpleGit, { SimpleGit } from "simple-git";
import { repoLocation } from "../..";
import fs from "fs";

export type RepoHistoryT = {
  name: string;
  completed: boolean;
  history: { hash: string; date: string; shortDate: string }[];
  curCommit?: string;
};

const dirInDir = () =>
  fs
    .readdirSync(`${repoLocation}/`, { withFileTypes: true })
    .filter((item) => item.isDirectory())
    .map((item) => item.name);

const getHistory = async (repo: string): Promise<RepoHistoryT> => {
  const git = simpleGit({
    baseDir: `${repoLocation}/${repo}`,
    binary: "git",
    maxConcurrentProcesses: 1,
  });

  const res = await git.log();

  const commits = res.all
    .map(({ hash, date }) => ({
      hash,
      date,
      shortDate: date.substring(0, 7),
    }))
    .filter(
      (v, i, a) => a.findIndex((v2) => v2.shortDate === v.shortDate) === i
    );

  return { name: repo, completed: false, history: commits };
};

export const getRepoHistories = async () => {
  const dirs = dirInDir().slice(0, 6);

  let res: RepoHistoryT[] = [];

  for (const key of dirs) {
    try {
      const history = await getHistory(key);
      res.push(history);
    } catch (error) {
      console.log(`${key} failed`);
    }
  }

  return res;
};

export const getAllDates = (data: RepoHistoryT[]): string[] => {
  const dateSet = new Set<string>();
  data.forEach((x) => x.history.map((y) => dateSet.add(y.shortDate)));
  return [...dateSet.keys()];
};
