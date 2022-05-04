import fs from "fs";
import { filesLocation } from "..";

export const writeData = (data: any, path?: string) =>
  fs.writeFileSync(path ?? `${filesLocation}/result.json`, data);
