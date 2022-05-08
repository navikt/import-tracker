import { GroupedFilesByRepoT } from "../find-files";
import { Project } from "ts-morph";

/* Gets each import in ts-file and how its declared */
const getImports = (filepath: string): ImportT[] => {
  const project = new Project();
  const sourceFile = project.addSourceFileAtPath(filepath);
  const imports = sourceFile.getImportDeclarations();

  return imports
    .map((x) => ({
      fileName: filepath,
      name: x.getModuleSpecifierValue(),
      defaultDef: !!x.getDefaultImport(),
      nameSpace: !!x.getNamespaceImport(),
      named: x.getNamedImports().map((x) => x?.removeAlias()?.getText()),
    }))
    .filter(
      (x) =>
        x.name.startsWith("@navikt/ds-react") ||
        x.name.startsWith("@navikt/ds-icons")
    );
};

export type ImportT = {
  fileName: string;
  name: string;
  defaultDef: boolean | undefined;
  nameSpace: boolean;
  named: string[] | undefined;
};

export type GroupedTsImportsT = {
  name: string;
  last_update: Date | null;
  source: string;
  files: ImportT[][];
};

export const mapImports = (
  source: GroupedFilesByRepoT[]
): GroupedTsImportsT[] => {
  try {
    return source
      .map((repo, y) => {
        console.log(y);
        return {
          ...repo,
          files: repo.files.map((x) => getImports(x)),
        };
      })
      .filter((x) => x.files.length > 0);
  } catch (error) {
    console.error("Failed Ts-parsing in parse-code.ts");
    return [];
  }
};
