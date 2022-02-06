import git from "./git";
import { updateLastCrawl } from "./metadata";
import parsing from "./parsing";

export const repoLocation = "crawler/files/repositories";

const Crawler = async () => {
  /* Jobs */
  await git();
  await parsing();

  /* Update status */
  await updateLastCrawl();
  console.log("Completed!");
};

export default Crawler;
