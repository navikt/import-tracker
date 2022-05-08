import { files, getFiles } from "./get-pages";

const list = [
  "rgba(208, 92, 74, 1)",
  "rgba(130, 105, 162, 1)",
  "rgba(255, 170, 51, 1)",
  "rgba(193, 203, 51, 1)",
  "rgba(124, 218, 248, 1)",
  "rgba(51, 170, 95, 1)",
  "rgba(176, 176, 176, 1)",
  "rgba(51, 128, 165, 1)",
  "rgba(51, 134, 224, 1)",
];

function getColor(stringInput) {
  let stringUniqueHash = [...stringInput].reduce((acc, char) => {
    return char.charCodeAt(0) + ((acc << 5) - acc);
  }, 0);

  return list[Math.abs(stringUniqueHash) % 9];
}

export const getSummaryChart = (name: string) => {
  if (!files) getFiles();

  return {
    labels: files
      .map((y) =>
        y.name.split(" ")[0].substring(0, 5).split("-").reverse().join("/")
      )
      .slice(0, 14)
      .reverse(),
    datasets: files[0].importData
      .find((x) => x.name === name)
      .summary.namedImport.map((x) => ({
        label: x.name,
        backgroundColor: getColor(x.name),
        borderColor: getColor(x.name),
        data: files
          .map(
            (z) =>
              z.importData
                .find((x) => x.name === name)
                .summary.namedImport.find((u) => u.name === x.name)?.count ?? 0
          )
          .slice(0, 14)
          .reverse(),
      })),
  };
};
