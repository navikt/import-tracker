import type { NextApiRequest, NextApiResponse } from "next";
import Crawler from "../../crawler";

const crawl = (req: NextApiRequest, res: NextApiResponse) => {
  console.log(`Started crawler - ${new Date().toUTCString()}`);
  Crawler();
  res.status(200).json({ status: "Started crawler" });
};

export default crawl;
