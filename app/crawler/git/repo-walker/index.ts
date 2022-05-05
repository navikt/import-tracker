import { getAllDates, getRepoHistories } from "./histories";
import walkRepos from "./walk-repos";

const walker = async () => {
  const histories = await getRepoHistories();
  const dates = getAllDates(histories);
  await walkRepos(histories, dates);
};

export default walker;
