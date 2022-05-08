import { files, getFiles, getPages } from "./get-pages";

export const getLastUpdate = (): string => {
  if (!files) getFiles();

  return files[0].name.substring(0, 5).replace("-", "/");
};
