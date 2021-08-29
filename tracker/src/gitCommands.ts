const fs = require("fs");
const path = require("path");
const NodeGit = require("nodegit");

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
        NodeGit.Clone(`cloneUrl`, repoPath, gitAuth)
          .then(function (repo: any) {
            // We don't want to directly pass `callback` because then the consumer gets a copy
            // of the repository object, which is public API
            resolve(null);
          })
          .catch(reject);
      } else {
        // Cloned already; we need to pull

        NodeGit.Repository.open(repoPath)
          .then(function (repository: any) {
            repository.fetchAll(gitAuth);
          })
          .then(function () {
            resolve(null);
          })
          .catch(reject);
      }
    });
  });

export default CloneOrPull;
