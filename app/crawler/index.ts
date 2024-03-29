import git from "./git";
import { updateLastCrawl } from "./metadata";
import parsing from "./parsing";
import fs from "fs";
import walker from "./git/repo-walker";

export const filesLocation = "crawler/files";
export const repoLocation = "crawler/files/repositories";

const Crawler = async () => {
  if (!fs.existsSync(filesLocation)) fs.mkdirSync(filesLocation);
  /* Jobs */
  await git();
  await parsing();

  /* Update status */
  await updateLastCrawl();

  await walker();
  console.log("Completed!");
};

export default Crawler;
