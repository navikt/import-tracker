import { importT, packageImportT } from "./get-imports";

export type packageT = {
  [key: string]: packageUsesT;
};

export type packageUsesT = {
  uses: number;
  defaultUses: number;
  namedUses: { [key: string]: { uses: number; repos: string[] } };
  fileSource: string[];
};

const getDefaultUses = (imports: importT[]) => {
  return imports.filter((imp) => imp.default).length;
};

const getNamedUses = (
  imports: importT[],
  namedUses: { [key: string]: { uses: number; repos: string[] } },
  file: string
) => {
  const newObj = Object.assign({}, namedUses);

  imports
    .filter((imp) => !imp.default)
    .forEach((imp) => {
      newObj[imp.name] =
        imp.name in newObj
          ? {
              uses: newObj[imp.name].uses + 1,
              repos: [...newObj[imp.name].repos, file],
            }
          : { uses: 1, repos: [] };
    });
  return newObj;
};

export const packageEntry = (entry: packageImportT, packageObj: packageT) => {
  if (!(entry.source in packageObj)) {
    packageObj[entry.source] = {
      uses: 1,
      defaultUses: getDefaultUses(entry.imports),
      namedUses: getNamedUses(
        entry.imports,
        {},
        entry.fileSource?.replace("./repos/", "") as string
      ),
      fileSource: [entry.fileSource?.replace("./repos/", "") as string],
    };
  } else {
    packageObj[entry.source] = {
      uses: packageObj[entry.source].uses + 1,
      defaultUses:
        packageObj[entry.source].defaultUses + getDefaultUses(entry.imports),
      namedUses: getNamedUses(
        entry.imports,
        packageObj[entry.source].namedUses,
        entry.fileSource?.replace("./repos/", "") as string
      ),
      fileSource: [
        ...packageObj[entry.source].fileSource,
        entry.fileSource?.replace("./repos/", "") as string,
      ].sort(),
    };
  }
};

export const manipulateImportData = (imports: packageImportT[][]) => {
  console.log("Starting parsing of import-data");
  let packages: packageT = {};
  let counter = 0;
  imports.forEach((imp: packageImportT[], y) => {
    imp.forEach((x) => {
      packageEntry(x, packages);
    });

    counter = counter + 1;
    counter % 1000 == 0 &&
      process.stdout.write(`\x1Bc\r Imports: ${counter}/${imports.length}`);
  });
  console.log("\nFinished parsing of import-data");
  const newPack = packages;
  return newPack;
};
