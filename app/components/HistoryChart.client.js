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

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const HistoryTable = ({ data }) => {
  return (
    <div className="relative mt-8 w-full overflow-scroll rounded-lg bg-white px-4 py-2 shadow-md">
      <Line data={data} />
    </div>
  );
};

export default HistoryTable;
