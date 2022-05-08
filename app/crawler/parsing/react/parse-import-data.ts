import { GroupedTsImportsT } from "./map-imports";

type NamedImportSummaryT = {
  name: string;
  count: number;
  files: string[];
};

export type ImportSummaryT = {
  name: string;
  count: number;
  repo: string[];
  exeptions: {
    name: string;
    files: string[];
  }[];
  summary: {
    defaultImport: {
      count: number;
      files: string[];
    };
    nameSpaceImport: {
      count: number;
      files: string[];
    };
    namedImport: NamedImportSummaryT[];
  };
};

const constructSummary = (name: string) => ({
  name,
  count: 0,
  repo: [],
  exeptions: [],
  summary: {
    defaultImport: {
      count: 0,
      files: [],
    },
    nameSpaceImport: {
      count: 0,
      files: [],
    },
    namedImport: [],
  },
});

const generateSummary = (
  summary: ImportSummaryT,
  source: GroupedTsImportsT[]
): ImportSummaryT => {
  const sum = { ...summary };

  source.forEach((s) => {
    const filtered = s.files.flat().filter((x) => x.name.startsWith(sum.name));
    filtered.forEach((imp) => {
      sum.count = sum.count + 1;
      !sum.repo.includes(s.name) && sum.repo.push(s.name);
      if (imp.defaultDef) {
        const def = { ...sum.summary.defaultImport };
        def.count += 1;
        !def.files.includes(imp.fileName) && def.files.push(imp.fileName);
        sum.summary.defaultImport = def;
      } else if (imp.nameSpace) {
        const nameS = { ...sum.summary.nameSpaceImport };
        nameS.count += 1;
        !nameS.files.includes(imp.fileName) && nameS.files.push(imp.fileName);
        sum.summary.nameSpaceImport = nameS;
      } else if (imp.named) {
        const named = [...sum.summary.namedImport];

        imp.named.forEach((x) => {
          const found = named.find((y) => y.name === x);
          if (found) {
            found.count += 1;
            !found.files.includes(imp.fileName) &&
              found.files.push(imp.fileName);
          } else {
            named.push({ count: 1, name: x, files: [imp.fileName] });
          }
        });

        sum.summary.namedImport = named;
      }
    });
  });

  return sum;
};

export const parseImportData = (
  source: GroupedTsImportsT[]
): ImportSummaryT[] => {
  const summaries = [
    "@navikt/ds-react",
    "@navikt/ds-react-internal",
    "@navikt/ds-icons",
  ].map(constructSummary);

  return summaries.map((x) => generateSummary(x, source));
};
