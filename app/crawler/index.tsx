import git from "./git";

const Crawler = async () => {
  console.time("Used time");

  await git();

  console.timeEnd("Used time");
};

export default Crawler;
