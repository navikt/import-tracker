const fs = require("fs");
const path = require("path");
const NodeGit = require("nodegit");
import pLimit from "p-limit";

export const cloneRepos = async (repos: string[]) => {
  console.log("Starting repo clone/pull");
  const limiter = pLimit(10);
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
  ).then(() => console.log("Finished repo clone/pull"));
};


const gitAuth = {
  fetchOpts: {
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
        // Cloned already; we need to pull
        /* console.log("merging repo"); */
        /*
        let currentBranch: Git.Reference = await repo.getCurrentBranch();

let currentBranchName: string = currentBranch.shorthand();
 */
        /* NodeGit.Repository.open(repoPath)
          .then(async (x: any) => {
            await x.fetchAll(gitAuth);
            return x;
          })
          .then(async (x: any) => {
            const currentBranch = await x.getCurrentBranch();
            x.mergeBranches(
              currentBranch.shorthand(),
              `origin/${currentBranch.shorthand()}`
            );
          })
          .then(() => resolve(null))
          .catch((e: Error) => {
            console.log("FAILED ON Fetch/merge");
            reject(e);
          }); */
      }
    });
  });

export default CloneOrPull;
