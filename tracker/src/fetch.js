const { Octokit } = require("@octokit/core");
const { paginateRest } = require("@octokit/plugin-paginate-rest");
const { retry } = require("@octokit/plugin-retry");

const octokit = Octokit.plugin(paginateRest, retry).defaults({
  userAgent: "Designsystem-import-tracker-v2",
  auth: process.env.TOKEN,
});

const MyOctokit = new octokit();

const fetchRepos = async () =>
  await (
    await MyOctokit.paginate("GET /orgs/navikt/repos", { per_page: 100 })
  ).map((repo) => repo.name);

export default fetchRepos;
