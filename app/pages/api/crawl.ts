import type { NextApiRequest, NextApiResponse } from "next";
import Crawler from "../../crawler";

let RUNNING = false;
let STATUS = "OK";

export const getStatus = () => STATUS;

const crawl = (req: NextApiRequest, res: NextApiResponse) => {
  if (RUNNING) {
    res.status(200).json({ status: "Crawler already running" });
    return;
  }

  if (STATUS !== "OK") {
    res.status(500).json({
      status: "500 - Internal server error",
      message: `Aborting crawl synce something has failed. Try restarting. Error: ${STATUS}`,
    });
    return;
  }

  RUNNING = true;

  console.log(`Started crawler - ${new Date().toUTCString()}`);

  Crawler()
    .then(() => {
      RUNNING = false;
      STATUS = "OK";
    })
    .catch((e: Error) => {
      STATUS = e.message;
      RUNNING = false;
    });

  res.status(200).json({ status: "Started crawler" });
};

export default crawl;
