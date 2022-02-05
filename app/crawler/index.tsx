import git from "./git";
import { updateLastCrawl } from "./metadata";

export const repoLocation = "crawler/files/repositories";

const Crawler = async () => {
  await git();
  await updateLastCrawl();

  console.log("Completed!");
};

export default Crawler;
