import simpleGit, { SimpleGit } from "simple-git";
import { repoLocation } from "../..";
import checkoutRepos from "./checkout-repos";
import { RepoHistoryT } from "./histories";
import fs from "fs";
import Parsing from "../../parsing/index";

const prepareRepos = (
  histories: RepoHistoryT[],
  date: string
): RepoHistoryT[] => {
  const curDate = new Date(date);

  const checked = histories.map((repo) => {
    if (repo.completed) return repo;
    let hist = [...repo.history];

    while (hist.length > 0 && new Date(hist[0].shortDate) > curDate) {
      const [_, ...rest] = hist;
      hist = [...rest];
    }
    if (hist.length === 0) {
      return { ...repo, history: hist, completed: true };
    }

    return { ...repo, history: hist };
  });

  return [...checked];
};

const generateJsonData = async (histories: RepoHistoryT[], date) => {
  histories.forEach(
    (x) =>
      x.completed &&
      fs.rmSync(`${repoLocation}/${x.name}`, { recursive: true, force: true })
  );

  await Parsing(date);

  return histories.filter((x) => !x.completed);
};

const walkRepos = async (hist: RepoHistoryT[], dates: string[]) => {
  let histories = [...hist];

  for (const key of dates) {
    histories = prepareRepos(histories, key);
    console.count("prepared");
    histories = await checkoutRepos(histories);
    console.count("checkedout");
    histories = await generateJsonData(histories, key);
    console.log(key);
  }

  console.log("walked");
};

export default walkRepos;
