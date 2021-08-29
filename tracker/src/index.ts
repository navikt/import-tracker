require("dotenv").config();
import { getImports, packageImportT } from "./get-imports";
import { manipulateImportData } from "./imports-stats";
import glob from "fast-glob";
import getRepoNames from "./repo-names";
import { cloneRepos } from "./clone-repos";
const fs = require("fs");
const uniq = require("lodash.sorteduniq");

const getFiles = async () => {
  console.log("Starting Globbing og tsx|jsx|js|ts files");
  let files = await glob("./repos/**/*.+(tsx|jsx|js|ts)", { dot: true });
  console.log("Finished Globbing og tsx|jsx|js|ts files");
  return (files = files.filter(
    (file) =>
      !file.includes("node_modules") || !file.includes("nav-frontend-moduler")
  ));
};

const main = async () => {
  let imports: packageImportT[][] = [];

  if (process.env.FULLRUN) {
    const repos = await getRepoNames();
    await cloneRepos(repos);
    const files = await getFiles();
    imports = await getImports(files);
    fs.writeFileSync("./raw-imports.json", JSON.stringify(imports));
  }
  fs.access("./raw-imports.json", (err: Error) => {
    if (err) {
      throw new Error("No raw-imports.json to parse data from");
    }
    let rawdata: packageImportT[][] = JSON.parse(
      fs.readFileSync("./raw-imports.json")
    );
    rawdata = rawdata.filter(
      (x) => x.filter((y) => y.source.startsWith("@navikt/ds-")).length > 0
    );
    const data = manipulateImportData(rawdata);
    fs.writeFileSync("../website/public/imports.json", JSON.stringify(data));
    /* console.log(JSON.stringify(data["@navikt/ds-react"], null, 2));  */
    let repos = uniq(
      data["@navikt/ds-react"].fileSource.map((x) => x.split("/")[0])
    );
    console.log(repos);
  });
};

try {
  main();
} catch (e) {
  console.error(e);
}
