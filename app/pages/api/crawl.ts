import type { NextApiRequest, NextApiResponse } from "next";
import Crawler from "../../crawler";

let RUNNING = false;

const crawl = (req: NextApiRequest, res: NextApiResponse) => {
  if (RUNNING) {
    res.status(200).json({ status: "Crawler already running" });
    return;
  }

  RUNNING = true;

  console.log(`Started crawler - ${new Date().toUTCString()}`);
  Crawler().then(() => {
    RUNNING = false;
  });
  res.status(200).json({ status: "Started crawler" });
};

export default crawl;
