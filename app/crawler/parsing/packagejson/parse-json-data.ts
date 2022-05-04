import { GroupedPackagesByRepoT } from "./read-packagejsons";

type PackageSummary = {
  counter: number;
  versions: Map<string, string[]>;
};

export type PackageJsonResults = {
  packages: Map<string, PackageSummary>;
};

const updatePackageMap = (
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
  source: GroupedPackagesByRepoT[]
): Map<string, PackageSummary> => {
  let packages = new Map();

  source.map((data) => {
    data.files.map((file) => {
      if (file?.dependencies) {
        Object.entries(file.dependencies).map(([key, val]) => {
          packages = updatePackageMap(key, val, data.name, packages);
        });
      }
      if (file?.devDependencies) {
        Object.entries(file.devDependencies).map(([key, val]) => {
          packages = updatePackageMap(key, val, data.name, packages);
        });
      }
      if (file?.peerDependencies) {
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
  /* const dependencies = new Map();
  const peerDependencies = new Map();
  const devDependencies = new Map(); */

  try {
    return { packages: getPackageSummary(source) };
  } catch (error) {
    throw error;
  }
};

/* function replacer(key, value) {
  if (value instanceof Map) {
    return {
      _type: "map",
      map: [...value],
    };
  } else return value;
} */

/* function reviver(key, value) {
    if (value._type == "map") return new Map(value.map);
    else return value;
  } */
