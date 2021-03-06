import fs from "fs";
import simpleGit, { SimpleGit } from "simple-git";
import { repoLocation } from "..";
import { readMetadata, RepoMetadataT } from "../metadata";
import getConfig from "next/config";

export const cloneSelected = async (git: SimpleGit, repos: RepoMetadataT[]) => {
  const { serverRuntimeConfig } = getConfig();

  if (repos.length === 0) return;
  await Promise.all(
    repos.map((repo) =>
      git
        .clone(
          `https://${serverRuntimeConfig.gh_token}:x-oauth-basic@github.com/navikt/${repo.name}`,
          repo.name,
          { "--depth": 1 }
        )
        .catch((e) => {
          console.error(`Failed ${repo.name}`);
        })
    )
  );
};

const getUnsyncedRepos = (repos: RepoMetadataT[]) =>
  repos.filter((repo) => !fs.existsSync(`${repoLocation}/${repo.name}`));

const clone = async () => {
  const metadata = await readMetadata().catch(() => {
    throw new Error("Could not read metadata - clone-repos.ts ");
  });
  if (!metadata.repos)
    throw new Error("No repos to clone, should be 600+ - clone-repos.ts");

  /* Make sure dir for repos is created for simple-git */
  if (!fs.existsSync(repoLocation)) fs.mkdirSync(repoLocation);

  /* Simple-git handles max-concurrent clone calls */
  const git = simpleGit({
    baseDir: repoLocation,
    binary: "git",
    maxConcurrentProcesses: 10,
  });

  await cloneSelected(
    git,
    getUnsyncedRepos(metadata.repos).sort((a, b) =>
      a.name.localeCompare(b.name)
    )
  ).catch((e) => console.error(e));
};

export default clone;
