import clone from "./clone";
import removeUnsynced from "./remove-unsynced";
import syncGit from "./sync-git";
import log from "./log";

const Git = async () => {
  await log();
  /* await syncGit();
  await removeUnsynced();
  await clone(); */
  console.log("Finished GITHUB-job");
};

export default Git;
