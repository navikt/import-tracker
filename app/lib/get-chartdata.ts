import { files, getFiles } from "./get-pages";

const nameMap = {
  packages: { name: "Brukt totalt", color: "rgba(0, 86, 180, 1)" },
  packagesDeps: { name: "dependencies", color: "rgba(51, 170, 95, 1)" },
  packagesDevDeps: { name: "devDependencies", color: "rgba(255, 145, 0, 1)" },
  packagesPeerDeps: {
    name: "peerDependencies",
    color: "rgba(0, 86, 180, 0.5)",
  },
};

export const getChartData = (name: string) => {
  if (!files) getFiles();

  return {
    labels: files
      .map((y) =>
        y.name.split(" ")[0].substring(0, 5).split("-").reverse().join("/")
      )
      .reverse(),
    datasets: [
      "packages",
      "packagesDeps",
      "packagesDevDeps",
      "packagesPeerDeps",
    ].map((x) => ({
      label: nameMap[x].name,
      backgroundColor: nameMap[x].color,
      borderColor: nameMap[x].color,
      data: files.map((z) => z.data[x].get(name)?.counter ?? 0).reverse(),
    })),
  };
};
