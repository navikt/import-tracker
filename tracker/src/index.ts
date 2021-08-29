require("dotenv").config();
import { getImports } from "./get-imports";
import { manipulateImportData } from "./importsStats";
import glob from "fast-glob";
import getRepoNames from "./repo-names";
import {cloneRepos} from "./clone-repos";
const fs = require("fs");

const getFiles = async () => {
  let files = await glob("./repos/**/*.+(tsx|jsx|js|ts)", { dot: true });
  return files = files.filter(
    (file) =>
      !file.includes("node_modules") || !file.includes("nav-frontend-moduler")
  );
}

const main = async () => {
  const repos = await getRepoNames();
  await cloneRepos(repos);
  const files = await getFiles()
  const imports = await getImports(files);
  fs.writeFileSync("./raw-imports.json", JSON.stringify(imports));
  const data = manipulateImportData(imports);
  fs.writeFileSync("../website/public/imports.json", JSON.stringify(data));
};

try {
  main();
} catch (e) {
  console.error(e);
}
