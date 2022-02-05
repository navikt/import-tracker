import git from "./git";
import { updateLastCrawl, writeMetadata } from "./metadata";

export const repoLocation = "crawler/files/repositories";

const Crawler = async () => {
  await git();
  await updateLastCrawl();

  console.log("Finished CRAWL");
};

export default Crawler;
