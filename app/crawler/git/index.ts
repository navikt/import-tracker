import removeUnsyncedRepos from "./remove-unsynced-repos";
import syncGitRepos from "./sync-git-repos";

const Git = async () => {
  await syncGitRepos();
  await removeUnsyncedRepos();
  console.log("Finished GIT sync");
};

export default Git;
