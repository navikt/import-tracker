/* import { reviver } from "@/crawler/parsing/map-to-json"; */
import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { reviver } from "../crawler/parsing/map-to-json";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const getChartData = (files, name) => {
  return {
    labels: files.map((x) =>
      x.name.split(" ")[0].substring(0, 5).split("-").reverse().join("/")
    ),
    datasets: [
      {
        label: "Bruk",
        backgroundColor: "rgba(0, 86, 180, 0.5)",
        borderColor: "rgba(0, 86, 180, 0.5)",
        data: files.map(
          (x) =>
            JSON.parse(JSON.stringify(x.data.packages), reviver).get(name)
              ?.counter ?? 0
        ),
      },
    ],
  };
};

const HistoryTable = ({ files, name, ...rest }) => {
  /* const data = JSON.parse(pack, reviver);
  const versions = new Map(
    [...data.versions].sort((a, b) => {
      return b[1].length - a[1].length;
    })
  ); */

  return (
    <div className="relative mt-8 w-full overflow-scroll rounded-lg bg-white px-4 py-2 shadow-md">
      <Line
        /* options={...} */
        data={getChartData(files.reverse(), name)}
      />
    </div>
  );
};
export default HistoryTable;
