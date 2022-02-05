import simpleGit, { SimpleGit, SimpleGitOptions } from "simple-git";
import { readMetadata, RepoMetadataT } from "../metadata";
import fs from "fs";
import { repoLocation } from "..";

// when setting all options in a single object

const cloneSelectedRepos = async (git: SimpleGit, repos: RepoMetadataT[]) => {
  if (repos.length === 0) return;
  console.time(`Cloned ${repos.length} repos`);
  console.log(`Started cloning of ${repos.length} repos`);

  let c = repos.length;
  let e = 0;

  await Promise.all(
    repos.map((repo) =>
      git
        .clone(
          `https://${process.env.TOKEN}:x-oauth-basic@github.com/navikt/${repo.name}`,
          repo.name,
          {
            "--depth": 1,
            "--no-checkout": true,
          }
        )
        .then(() => {
          c = c - 1;
          c % Math.floor(repos.length / 10) === 0 && console.log(c);
        })
        .catch((e) => {
          console.error(e);
          e = e + 1;
        })
    )
  );
  if (e !== 0) {
    console.warn(`${e} repos failed to clone.`);
  }
  console.timeEnd(`Cloned ${repos.length} repos`);
};

const getUnsyncedRepos = (repos: RepoMetadataT[]) =>
  repos.filter((repo) => !fs.existsSync(`${repoLocation}/${repo.name}`));

const cloneRepos = async () => {
  const metadata = await readMetadata().catch(() => {
    throw new Error("Could not read metadata - clone-repos.ts ");
  });
  if (!metadata.repos)
    throw new Error("No repos to clone, should be 600+ - clone-repos.ts");

  /* Make sure dir for repos is created for simple-git */
  if (!fs.existsSync(repoLocation)) fs.mkdirSync(repoLocation);

  const git = simpleGit({
    baseDir: repoLocation,
    binary: "git",
    maxConcurrentProcesses: 10,
  });

  await cloneSelectedRepos(git, getUnsyncedRepos(metadata.repos)).catch((e) =>
    console.error(e)
  );
};

export default cloneRepos;
