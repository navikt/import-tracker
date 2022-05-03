import { Octokit } from "@octokit/core";
import { paginateRest } from "@octokit/plugin-paginate-rest";
import { retry } from "@octokit/plugin-retry";
import {
  metadataNeedsSync,
  readMetadata,
  RepoMetadataListT,
  writeMetadata,
} from "../metadata";

const octokit = Octokit.plugin(paginateRest, retry).defaults({
  userAgent: "Designsystem-dependency crawler",
  auth: process.env.TOKEN,
});

const MyOctokit = new octokit();

const languages = [
  "typescript",
  "javascript",
  "css",
  "markdown",
  "html",
  "tsx",
  "jsx",
  "json",
  "scss",
];

const syncGit = async (): Promise<RepoMetadataListT> => {
  /* Skip sync if data is assumed "fresh" */
  if (!metadataNeedsSync(await readMetadata().catch(() => null))) return;

  /* Fetches all repos in NAVIKT and cherrypicks wanted metadata */
  let repos = await MyOctokit.paginate("GET /orgs/navikt/repos", {
    per_page: 100,
  }).then((r) =>
    r.map(({ name, language, pushed_at, archived }) => ({
      name,
      language,
      pushed_at,
      archived,
    }))
  );
  console.log({ b: repos.length });
  /* Lets skip archived and assumed irrelevant languages */
  repos = repos
    .filter((r) => !r.archived)
    .filter((r) => languages.includes(r.language?.toLowerCase?.()));
  console.log({ a: repos.length });
  const data: Partial<RepoMetadataListT> = { repo_sync: new Date(), repos };

  await writeMetadata(data).catch(() =>
    console.error("Falied syncing metadata")
  );
};

export default syncGit;
