import { readMetadata, RepoMetadataT } from "../metadata";
import fs from "fs";
import { repoLocation } from "..";

/* Force deletes repos, ignored if repo dir doesn't exist */
const deleteRepos = (repos: RepoMetadataT[]) =>
  repos.forEach((repo) =>
    fs.rmSync(`${repoLocation}/${repo}`, { force: true, recursive: true })
  );

/**
 * Instead of running git pull on repos with changes,
 * we just delete them and re-clone them later.
 */
const removeUnsyncedRepos = async () => {
  const metadata = await readMetadata().catch(() => {
    throw new Error("Could not read metadata - remove-unsynced-repos.ts ");
  });
  if (!metadata.last_crawl || !metadata.repos) return;

  /* All repos with pushed changes after last crawl */
  const unsyncedRepos = metadata.repos.filter(
    (repo) =>
      new Date(repo.pushed_at).getMilliseconds() >
      new Date(metadata.last_crawl).getMilliseconds()
  );

  /* Delete all unsynced repos so we can clone them again */
  deleteRepos(unsyncedRepos);
};

export default removeUnsyncedRepos;
