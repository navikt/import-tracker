import git from "./git";
import { updateLastCrawl, writeMetadata } from "./metadata";

const Crawler = async () => {
  await git();
  await updateLastCrawl();

  console.log("Finished CRAWL");
};

export default Crawler;
