import {opt} from "./index";
import {importT, packageImportT} from "./getImports";
const cliProgress = require("cli-progress");

export type packageT = {
  [key: string]: packageUsesT;
};

export type packageUsesT = {
  uses: number;
  defaultUses: number;
  namedUses: {[key: string]: number};
};

const getDefaultUses = (imports: importT[]) => {
  return imports.filter((imp) => imp.default).length;
};

const getNamedUses = (imports: importT[], namedUses: {[key: string]: number}) => {
  const newObj = Object.assign({}, namedUses);

  imports
    .filter((imp) => !imp.default)
    .forEach((imp) => {
      newObj[imp.name] = imp.name in newObj ? newObj[imp.name] + 1 : 1;
    });
  return newObj;
};

export const packageEntry = (entry: packageImportT, packageObj: packageT) => {
  /* entry.source === "nav-frontend-skjema" && console.count("skjema"); */
  if (!(entry.source in packageObj)) {
    packageObj[entry.source] = {
      uses: 1,
      defaultUses: getDefaultUses(entry.imports),
      namedUses: getNamedUses(entry.imports, {}),
    };
  } else {
    packageObj[entry.source] = {
      uses: packageObj[entry.source].uses + 1,
      defaultUses: packageObj[entry.source].defaultUses + getDefaultUses(entry.imports),
      namedUses: getNamedUses(entry.imports, packageObj[entry.source].namedUses),
    };
  }
};

export const manipulateImportData = (imports: packageImportT[][]) => {
  let packages: packageT = {};
  const bar1 = new cliProgress.SingleBar(
    opt("Import data"),
    cliProgress.Presets.shades_classic
  );
  bar1.start(imports.length, 0);
  imports.forEach((imp: packageImportT[], y) => {
    imp.forEach((x) => {
      packageEntry(x, packages);
    });
    bar1.increment();
  });
  bar1.stop();
  return packages;
};
