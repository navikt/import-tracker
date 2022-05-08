import type { NextApiRequest, NextApiResponse } from "next";
import { getIndexedList } from "../../lib/get-data";

const list = (req: NextApiRequest, res: NextApiResponse) => {
  res.status(200).json(getIndexedList());
};

export default list;
