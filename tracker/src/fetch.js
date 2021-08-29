const { Octokit } = require("@octokit/core");
const { paginateRest } = require("@octokit/plugin-paginate-rest");
const { retry } = require("@octokit/plugin-retry");

const octokit = Octokit.plugin(paginateRest, retry).defaults({
  userAgent: "Designsystem-import-tracker-v2",
  auth: process.env.TOKEN,
});

const MyOctokit = new octokit();

const fetchRepos = async () => {
  console.log("Fetching all repo-names from navikt-org");
  const repos = await (
    await MyOctokit.paginate("GET /orgs/navikt/repos", { per_page: 100 })
  ).map((repo) => repo.name);
  console.log("Finished fetching all repo-names from navikt-org");
  return repos;
};

export default fetchRepos;
