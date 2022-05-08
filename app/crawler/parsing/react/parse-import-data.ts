import { GroupedTsImportsT } from "./map-imports";

type NamedImportSummaryT = {
  name: string;
  count: number;
  files: string[];
};

type ImportSummaryT = {
  name: string;
  count: number;
  repo: string[];
  exeptions: {
    name: string;
    files: string[];
  };
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

export const parseImportData = (
  source: GroupedTsImportsT[]
): ImportSummaryT[] => {
  return [];
};
