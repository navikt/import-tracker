import { Octokit } from "@octokit/core";
import { paginateRest } from "@octokit/plugin-paginate-rest";
import { retry } from "@octokit/plugin-retry";
import fs from "fs";

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

const getRepoMetadata = async () => {
  const repos = await MyOctokit.paginate("GET /orgs/navikt/repos", {
    per_page: 100,
  });

  fs.writeFileSync(
    "crawler/files/repo-names.json",
    JSON.stringify(repos, null, 2)
  );

  /* return repos
    .filter((x) => languages.includes(x.language?.toLowerCase()))
    .map((x) => x.name); */
  console.log(process.env.TOKEN);
};

export default getRepoMetadata;
