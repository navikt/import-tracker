const { Octokit } = require("@octokit/core");
const { paginateRest } = require("@octokit/plugin-paginate-rest");
const { retry } = require("@octokit/plugin-retry");
const fs = require("fs");
const repos = require("../repo-names.json");

const octokit = Octokit.plugin(paginateRest, retry).defaults({
  userAgent: "Designsystem-import-tracker-v2",
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

const fetchRepos = async () => {
  /* console.log("Fetching all repo-names from navikt-org"); */
  /* const repos = await MyOctokit.paginate("GET /orgs/navikt/repos", {
    per_page: 100,
  }); */

  /* fs.writeFileSync("./repo-names.json", JSON.stringify(repos, null, 2)); */

  return repos
    .filter((x) => languages.includes(x.language?.toLowerCase()))
    .map((x) => x.name);
};

export default fetchRepos;
