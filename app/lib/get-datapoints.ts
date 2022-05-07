import { files, getFiles } from "./get-pages";

const dataFrom = (
  name: string,
  key?: "default" | "packagesDeps" | "packagesDevDeps" | "packagesPeerDeps",
  range?: number
) => {
  if (!files) getFiles();

  const dataKey = key && key !== "default" ? key : "packages";
  const current = files[0].data[dataKey].get(name)?.counter ?? 0;
  const prev = files[range ?? 3].data[dataKey].get(name)?.counter ?? 0;

  return { current: current, prev: prev };
};

const yearToDate = (name: string) => {
  if (!files) getFiles();

  const curYear = Number(files[0].name.substring(0, 2));

  const prevYear = files.find(
    (x) => curYear - Number(x.name.substring(0, 2)) === 1
  );

  const current = files[0].data["packages"].get(name)?.counter ?? 0;
  const prev = prevYear.data["packages"].get(name)?.counter ?? 0;

  return { current: current, prev: prev };
};

export const getDataPoints = (name: string) => {
  return {
    all: dataFrom(name),
    dep: dataFrom(name, "packagesDeps"),
    dev: dataFrom(name, "packagesDevDeps"),
    peer: dataFrom(name, "packagesPeerDeps"),
    yearToDate: yearToDate(name),
    halfYearTrend: dataFrom(name, "default", 6),
    YearTrend: dataFrom(name, "default", 12),
  };
};
