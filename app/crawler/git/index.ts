import clone from "./clone";
import removeUnsynced from "./remove-unsynced";
import syncGit from "./sync-git";

const Git = async () => {
  await syncGit();
  await removeUnsynced();
  await clone();
  console.log("Finished GITHUB-job");
};

export default Git;
