import type { NextApiRequest, NextApiResponse } from "next";
import { getStatus } from "./crawl";

const status = (req: NextApiRequest, res: NextApiResponse) => {
  const crawlStatus = getStatus();
  res.status(crawlStatus === "OK" ? 200 : 500).json({ status: getStatus() });
};

export default status;
