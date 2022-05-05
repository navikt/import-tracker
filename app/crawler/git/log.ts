import simpleGit, { SimpleGit } from "simple-git";
import { repoLocation } from "..";

const log = async () => {
  const git = simpleGit({
    baseDir: `${repoLocation}/aksel-website`,
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

  return null;
};

export default log;
