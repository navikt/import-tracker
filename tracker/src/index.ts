require("dotenv").config();
import { getImportsFromFile, packageImportT } from "./getImports";
import { manipulateImportData } from "./importsStats";
import glob from "fast-glob";
import fetch from "./fetch";
import pLimit from "p-limit";
import CloneOrPull from "./gitCommands";
const fs = require("fs");
const cliProgress = require("cli-progress");

export const opt = (name: string) => {
  return {
    format: `${name} [{bar}] {percentage}% | {value}/{total}`,
  };
};

export const pLimiter = async (repos: string[], func: Function) => {
  const bar1 = new cliProgress.SingleBar(
    opt("Clone/Pull repos"),
    cliProgress.Presets.shades_classic
  );
  bar1.start(repos.length, 0);
  const limiter = pLimit(50);

  return Promise.all(
    repos.map((repo, x) =>
      limiter(() =>
        func(repo)
          .then(bar1.increment())
          .catch((err: Error) => {
            bar1.increment();
            console.log(repo);
          })
      )
    )
  ).then(() => bar1.stop());
};

export const pLimiter2 = async (files: string[], func: Function) => {
  const bar1 = new cliProgress.SingleBar(
    opt("Imports from files"),
    cliProgress.Presets.shades_classic
  );
  bar1.start(files.length, 0);

  const limiter = pLimit(20);
  const imports: packageImportT[][] = [];
  await Promise.all(
    files.map((file, x) =>
      limiter(() =>
        func(file)
          .then((imp: packageImportT[]) => {
            imports.push(imp);
            bar1.increment();
          })
          .catch((err: Error) => {
            console.log(file);
            bar1.increment();
          })
      )
    )
  );
  bar1.stop();
  return imports;
};

const main = async () => {
  const repos = await fetch();
  await pLimiter(repos, CloneOrPull);
  let files = await glob("./repos/**/*.+(tsx|jsx|js|ts)", { dot: true });
  files = files.filter(
    (file) =>
      !file.includes("node_modules") || !file.includes("nav-frontend-moduler")
  );
  const imports = await pLimiter2(files, getImportsFromFile);
  const data = manipulateImportData(imports);
  fs.writeFileSync("../website/public/imports.json", JSON.stringify(data));
};

try {
  main();
} catch (e) {
  console.error(e);
}
