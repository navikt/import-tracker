import type { NextApiRequest, NextApiResponse } from "next";
import Crawler from "../../crawler";
import getConfig from "next/config";

let RUNNING = false;
let STATUS = "OK";

export const getStatus = () => STATUS;

const crawl = (req: NextApiRequest, res: NextApiResponse) => {
  const { serverRuntimeConfig } = getConfig();

  if (RUNNING) {
    res.status(200).json({ status: "Crawler already running" });
    return;
  }

  if (STATUS !== "OK") {
    res.status(500).json({
      status: "500 - Internal server error",
      message: `Aborting crawl sync something has failed. Try restarting. Error: ${STATUS}`,
    });
    return;
  }

  if (!serverRuntimeConfig.LOCAL) {
    res.status(200).json({ status: "Can only run crawler in local env" });
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
