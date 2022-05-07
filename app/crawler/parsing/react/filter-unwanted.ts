import { getGroupedFiles, GroupedFilesByRepoT } from "../find-files";

import { readPackageJsons } from "../packagejson/read-packagejsons";

const packages = ["@navikt/ds-react", "@navikt/ds-react-internal"];

/* Filter out all repos where wanted packages is not found reduce time needed to parse */
export const filterUnwanted = async (
  source: GroupedFilesByRepoT[]
): Promise<GroupedFilesByRepoT[]> => {
  const groupedPackageFiles = await getGroupedFiles(`**/package.json`);
  const readJsons = await readPackageJsons(groupedPackageFiles);

  const filteredNames = readJsons
    .filter(
      (x) =>
        !!x.files.find(
          (y) =>
            !!packages.find((x) => y?.dependencies && x in y?.dependencies) ||
            !!packages.find(
              (x) => y?.devDependencies && x in y?.devDependencies
            ) ||
            !!packages.find(
              (x) => y?.peerDependencies && x in y?.peerDependencies
            )
        )
    )
    .map((x) => x.name);

  return source.filter((x) => filteredNames.includes(x.name));
};
