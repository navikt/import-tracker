const core = require("@actions/core");
const github = require("@actions/github");
const { execSync } = require("child_process");

const octokit = github.getOctokit(process.env.GITHUB_TOKEN);

run();

async function run() {
  try {
    if (github.context.payload.pull_request.number === undefined) {
      return;
    }
    const ref = github.context.sha;
    /* console.log(ref); */
    let output;

    try {
      execSync("git checkout main");

      execSync(`git fetch  origin ${ref}`);

      execSync("ls");
      output = execSync(`yarn lerna version patch --no-push`, {
        input: "n",
      });
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
      issue_number: github.context.payload.pull_request.number,
      body: prText,
    });
  } catch (error) {
    core.setFailed(error.message);
  }
}
