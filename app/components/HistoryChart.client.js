import { reviver } from "@/crawler/parsing/map-to-json";
import React from "react";
import { Line } from "react-chartjs-2";

const HistoryTable = ({ files, ...rest }) => {
  /* const data = JSON.parse(pack, reviver);
  const versions = new Map(
    [...data.versions].sort((a, b) => {
      return b[1].length - a[1].length;
    })
  ); */

  return (
    <div className="relative mt-8 w-full overflow-scroll rounded-lg bg-white px-4 py-2 shadow-md">
      table
    </div>
  );
};
export default HistoryTable;
