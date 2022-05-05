import simpleGit, { SimpleGit } from "simple-git";
import { repoLocation } from "../..";
import { RepoHistoryT } from "./histories";

/**
 * git checkouts newest commit avaliable for each repo. Skips if allready checked out
 */
const checkoutRepos = async (
  histories: RepoHistoryT[]
): Promise<RepoHistoryT[]> => {
  let hist = [...histories];
  let compl: RepoHistoryT[] = [];

  for (const repo of hist) {
    if (repo.completed || repo?.curCommit === repo.history[0].hash) continue;

    const git = simpleGit({
      baseDir: `${repoLocation}/${repo.name}`,
      binary: "git",
      maxConcurrentProcesses: 1,
    });

    try {
      await git.checkout(repo.history[0].hash);
    } catch (e) {
      continue;
    }
    compl.push({ ...repo, curCommit: repo.history[0].hash });
  }
  return [...compl];
};

export default checkoutRepos;
