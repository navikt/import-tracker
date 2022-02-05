import simpleGit, { SimpleGit, SimpleGitOptions } from "simple-git";
import { readMetadata, RepoMetadataT } from "../metadata";
import fs from "fs";
import { repoLocation } from "..";

// when setting all options in a single object

const cloneSelectedRepos = async (git: SimpleGit, repos: RepoMetadataT[]) => {
  fs.mkdirSync(repoLocation);

  await Promise.all(
    repos.map((repo) =>
      git.clone(`https://github.com/navikt/${repo.name}`, repoLocation, {
        "--depth": 1,
      })
    )
  );
};

const getUnsyncedRepos = (repos: RepoMetadataT[]) =>
  repos.filter((repo) => fs.existsSync(`${repoLocation}/${repo.name}`));

const cloneRepos = async () => {
  const metadata = await readMetadata().catch(() => {
    throw new Error("Could not read metadata - clone-repos.ts ");
  });
  if (!metadata.repos)
    throw new Error("No repos to clone, should be 600+ - clone-repos.ts");

  console.log("befprec");

  const git = simpleGit({
    baseDir: repoLocation,
    binary: "git",
    maxConcurrentProcesses: 6,
    config: [`Authorization: token ${process.env.TOKEN}`],
  });

  await cloneSelectedRepos(
    git,
    getUnsyncedRepos(metadata.repos.slice(0, 5))
  ).catch((e) => console.error(e));

  console.log("after");
};

export default cloneRepos;
