import checkoutRepos from "./checkout-repos";
import { RepoHistoryT } from "./histories";

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
      return { ...repo, completed: true };
    }

    return { ...repo, history: hist };
  });

  return [...checked];
};

const walkRepos = async (hist: RepoHistoryT[], dates: string[]) => {
  console.log("walked");
  let histories = [...hist];

  for (const key of dates) {
    console.log(key);
    histories = prepareRepos(histories, key);
    await checkoutRepos(histories);
    console.log(histories);
  }
  /* console.log(JSON.stringify(hist, null, 2)); */
};

export default walkRepos;
