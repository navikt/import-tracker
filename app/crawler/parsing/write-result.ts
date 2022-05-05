import fs from "fs";
import { filesLocation } from "..";

const getTimeStr = (datestr: string) => {
  const date = datestr ? new Date(datestr) : new Date();

  return (
    `${date.getFullYear()}`.slice(2, 4) +
    "-" +
    ("00" + (date.getMonth() + 1)).slice(-2) +
    "-" +
    ("00" + date.getDate()).slice(-2) +
    " " +
    ("00" + date.getHours()).slice(-2) +
    "." +
    ("00" + date.getMinutes()).slice(-2)
  );
};

export const writeData = (data: any, datestr?: string) =>
  fs.writeFileSync(`${filesLocation}/${getTimeStr(datestr)}.json`, data);
