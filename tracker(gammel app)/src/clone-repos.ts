const fs = require("fs");
const path = require("path");
const NodeGit = require("nodegit");
import pLimit from "p-limit";

export const cloneRepos = async (repos: string[]) => {
  console.log("Starting repo clone/pull");

  const limiter = pLimit(2);
  let counter = 0;

  return Promise.all(
    repos.map((repo, x) =>
      limiter(() =>
        CloneOrPull(repo)
          .then(() => {
            counter = counter + 1;
            process.stdout.write(`\x1Bc\r Repos: ${counter}/${repos.length}`);
          })
          .catch((err: Error) => {
            console.log(err);
            console.log("Error cloning: " + repo + "\n\n");
          })
      )
    )
  ).then(() => console.log("\nFinished repo clone/pull"));
};

const gitAuth = {
  fetchOpts: {
    depth: 1,
    callbacks: {
      certificateCheck: function () {
        return 1;
      },
      credentials: function () {
        return NodeGit.Cred.userpassPlaintextNew(
          process.env.TOKEN,
          "x-oauth-basic"
        );
      },
    },
  },
};

const CloneOrPull = (name: string) =>
  new Promise((resolve, reject) => {
    const repoPath = path.join(process.cwd(), `repos/${name}`);

    const cloneUrl = `https://${process.env.TOKEN}:x-oauth-basic@github.com/navikt/${name}`;
    fs.access(repoPath, function (err: Error) {
      if (err) {
        NodeGit.Clone(cloneUrl, repoPath, gitAuth)
          .then(function (repo: any) {
            // We don't want to directly pass `callback` because then the consumer gets a copy
            // of the repository object, which is public API
            resolve(null);
          })
          .catch((e: Error) => {
            /* console.log("FAILED ON CLONE"); */
            reject(e);
          });
      } else {
        resolve(null);
      }
    });
  });

export default CloneOrPull;
