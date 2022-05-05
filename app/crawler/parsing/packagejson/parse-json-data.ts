import { GroupedPackagesByRepoT } from "./read-packagejsons";

type PackageSummary = {
  counter: number;
  versions: Map<string, string[]>;
};

export type PackageJsonResults = {
  packages: Map<string, PackageSummary>;
  packagesDeps: Map<string, PackageSummary>;
  packagesDevDeps: Map<string, PackageSummary>;
  packagesPeerDeps: Map<string, PackageSummary>;
  last90: Map<string, PackageSummary>;
  last180: Map<string, PackageSummary>;
};

export const updatePackageMap = (
  key: string,
  val: string,
  sourceRepo: string,
  map: Map<string, PackageSummary>
): Map<string, PackageSummary> => {
  const prevDep: { counter: number; versions: Map<string, string[]> } =
    map.get(key);

  if (prevDep) {
    let prevVersions: string[];
    prevVersions = prevDep.versions.get(val);
    prevDep.counter = prevDep.counter + 1;

    if (prevVersions) {
      prevVersions = [...prevVersions, sourceRepo];
      prevDep.versions.set(val, prevVersions);
    } else {
      prevDep.versions.set(val, [sourceRepo]);
    }
    map.set(key, prevDep);
  } else {
    map.set(key, { counter: 1, versions: new Map().set(val, [sourceRepo]) });
  }

  return map;
};

const getPackageSummary = (
  source: GroupedPackagesByRepoT[],
  opt: Partial<{
    dependencies: boolean;
    devDependencies: boolean;
    peerDependencies: boolean;
    beforeDate: Date;
  }> = {
    dependencies: true,
    devDependencies: true,
    peerDependencies: true,
  }
): Map<string, PackageSummary> => {
  let packages = new Map();

  let filteredSource = source;

  if (opt?.beforeDate) {
    filteredSource = filteredSource.filter((x) =>
      x?.last_update ? opt?.beforeDate < new Date(x?.last_update) : true
    );
  }

  filteredSource.map((data) => {
    data.files.map((file) => {
      if (file?.dependencies && opt?.dependencies) {
        Object.entries(file.dependencies).map(([key, val]) => {
          packages = updatePackageMap(key, val, data.name, packages);
        });
      }
      if (file?.devDependencies && opt?.devDependencies) {
        Object.entries(file.devDependencies).map(([key, val]) => {
          packages = updatePackageMap(key, val, data.name, packages);
        });
      }
      if (file?.peerDependencies && opt?.peerDependencies) {
        Object.entries(file.peerDependencies).map(([key, val]) => {
          packages = updatePackageMap(key, val, data.name, packages);
        });
      }
    });
  });

  return packages;
};

export const parseJsonData = (
  source: GroupedPackagesByRepoT[]
): PackageJsonResults => {
  try {
    return {
      packages: getPackageSummary(source),
      packagesDeps: getPackageSummary(source, { dependencies: true }),
      packagesDevDeps: getPackageSummary(source, { devDependencies: true }),
      packagesPeerDeps: getPackageSummary(source, { peerDependencies: true }),
      last90: getPackageSummary(source, {
        beforeDate: new Date(new Date().setDate(new Date().getDate() - 90)),
        dependencies: true,
        peerDependencies: true,
        devDependencies: true,
      }),
      last180: getPackageSummary(source, {
        beforeDate: new Date(new Date().setDate(new Date().getDate() - 180)),
        dependencies: true,
        peerDependencies: true,
        devDependencies: true,
      }),
    };
  } catch (error) {
    throw error;
  }
};
