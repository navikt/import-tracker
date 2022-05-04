import fs from "fs";
import { filesLocation } from "..";

const getTimeStr = () => {
  const date = new Date();

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

export const writeData = (data: any, path?: string) =>
  fs.writeFileSync(path ?? `${filesLocation}/${getTimeStr()}.json`, data);
