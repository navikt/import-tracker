const core = require("@actions/core");
const github = require("@actions/github");
const { execSync } = require("child_process");

const octokit = github.getOctokit(process.env.GITHUB_TOKEN);

run();

async function run() {
  try {
    let {
      data: prs,
    } = await octokit.rest.repos.listPullRequestsAssociatedWithCommit({
      ...github.context.repo,
      commit_sha: github.context.sha,
    });

    console.log(prs);
    console.log("Finished index.js run");
    if (!prs || !prs.length) {
      return;
    }

    let output;

    try {
      output = execSync(`yarn lerna version patch --no-push`, { input: "n" });
    } catch (error) {
      console.error(error.message);
      return;
    }

    const changes = output
      .toString()
      .split("\n")
      .filter((x) => x.startsWith(" - "))
      .map((x) => x.replace(" - ", ""));

    if (changes.length === 0) {
      return;
    }

    let prText = "### Disse endringene vil oppdatere disse pakkene:\n\n";
    changes.forEach((x) => {
      prText = prText + x + "\n";
    });

    await octokit.issues.createComment({
      ...github.context.repo,
      issue_number: prs[0].number,
      body: ``,
    });
  } catch (error) {
    core.setFailed(error.message);
  }
}
