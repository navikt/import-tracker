require("dotenv").config();
import { getImports, packageImportT } from "./get-imports";
import { manipulateImportData } from "./imports-stats";
import glob from "fast-glob";
import getRepoNames from "./repo-names";
import { cloneRepos } from "./clone-repos";
import { getPackageUsage } from "./package-usage";
const fs = require("fs");

const dsPackages = [
  "@navikt/ds-react",
  "@navikt/ds-css",
  "@navikt/ds-tokens",
  "@navikt/ds-icons",
];

const getFiles = async () => {
  console.log("Starting Globbing og tsx|jsx|js|ts files");
  let files = await glob("./repos/**/*.+(tsx|jsx|js|ts)", { dot: true });
  console.log("Finished Globbing og tsx|jsx|js|ts files");
  return (files = files.filter(
    (file) =>
      !file.includes("node_modules") || !file.includes("nav-frontend-moduler")
  ));
};

const filterPackageNames = (data: packageImportT[][]) =>
  data.filter(
    (x) => x.filter((y) => y.source.startsWith("@navikt/ds-")).length > 0
  );

const main = async () => {
  let imports: packageImportT[][] = [];

  if (process.env.FULLRUN) {
    /* const repos = await getRepoNames();
    await cloneRepos(repos); */
    const files = await getFiles();
    imports = await getImports(files);
    fs.writeFileSync("./raw-imports.json", JSON.stringify(imports));
  }
  await fs.access("./raw-imports.json", async (err: Error) => {
    if (err) {
      throw new Error("No raw-imports.json to parse data from");
    }
    let rawData: packageImportT[][] = JSON.parse(
      fs.readFileSync("./raw-imports.json")
    );
    rawData = filterPackageNames(rawData);
    const data = manipulateImportData(rawData);
    fs.writeFileSync("../app/public/imports.json", JSON.stringify(data));

    const info = await getPackageUsage(dsPackages, data);

    fs.writeFileSync(
      "../app/package-versions.json",
      JSON.stringify(info, null, 2)
    );
  });
};

try {
  main();
} catch (e) {
  console.error(e);
}
