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
    console.log(github.context);
    const ref = github.context.sha;

    let output;
    if (github.context.payload.pull_request.title)
      const title = github.context.payload.pull_request.title;
    let version = "";
    switch (true) {
      case title.includes("[fix]"):
        version = "patch";
        break;
      case title.includes("[feature]"):
        version = "minor";
        break;
      case title.includes("[breaking]"):
        version = "major";
        break;
      default:
        return;
    }
    try {
      execSync("git checkout main");

      execSync(`git fetch  origin ${ref}`);

      execSync("ls");
      output = execSync(`yarn lerna version ${version} --no-push`, {
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

    let prText = "### Denne PRen vil oppdatere disse pakkene:\n\n";
    changes.forEach((x) => {
      prText = `${prText} - ${x}\n`;
    });

    const comments = await octokit.rest.issues.listComments({
      ...github.context.repo,
      issue_number: github.context.payload.pull_request.number,
    });

    let commentId = "";
    comments.forEach((x) => {
      if (x.user.login === "github-actions[bot]") {
        commentId = x.id;
      }
    });

    if (commentId !== "") {
      await octokit.rest.issues.deleteComment({
        ...github.context.repo,
        comment_id: commentId,
      });
    }

    await octokit.rest.issues.createComment({
      ...github.context.repo,
      issue_number: github.context.payload.pull_request.number,
      body: prText,
    });
  } catch (error) {
    core.setFailed(error.message);
  }
}
