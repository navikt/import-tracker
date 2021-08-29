import { importT, packageImportT } from "./get-imports";
const cliProgress = require("cli-progress");

export type packageT = {
  [key: string]: packageUsesT;
};

export type packageUsesT = {
  uses: number;
  defaultUses: number;
  namedUses: { [key: string]: number };
  fileSource: string[];
};

const getDefaultUses = (imports: importT[]) => {
  return imports.filter((imp) => imp.default).length;
};

const getNamedUses = (
  imports: importT[],
  namedUses: { [key: string]: number }
) => {
  const newObj = Object.assign({}, namedUses);

  imports
    .filter((imp) => !imp.default)
    .forEach((imp) => {
      newObj[imp.name] = imp.name in newObj ? newObj[imp.name] + 1 : 1;
    });
  return newObj;
};

export const packageEntry = (entry: packageImportT, packageObj: packageT) => {
  if (!(entry.source in packageObj)) {
    packageObj[entry.source] = {
      uses: 1,
      defaultUses: getDefaultUses(entry.imports),
      namedUses: getNamedUses(entry.imports, {}),
      fileSource: [entry.fileSource?.replace("./repos/", "") as string],
    };
  } else {
    packageObj[entry.source] = {
      uses: packageObj[entry.source].uses + 1,
      defaultUses:
        packageObj[entry.source].defaultUses + getDefaultUses(entry.imports),
      namedUses: getNamedUses(
        entry.imports,
        packageObj[entry.source].namedUses
      ),
      fileSource: [
        ...packageObj[entry.source].fileSource,
        entry.fileSource?.replace("./repos/", "") as string,
      ].sort(),
    };
  }
};

export const manipulateImportData = (imports: packageImportT[][]) => {
  let packages: packageT = {};
  imports.forEach((imp: packageImportT[], y) => {
    imp.forEach((x) => {
      packageEntry(x, packages);
    });
  });

  const newPack = packages;
  return newPack;
};
