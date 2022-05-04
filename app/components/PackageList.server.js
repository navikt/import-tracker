import React from "react";
import ListButton from "./ListButton.server";
import { reviver } from "../crawler/parsing/map-to-json";

const PackageList = ({ data, ...rest }) => {
  /* const refresh = useRefreshRoot();
  const [isSearching, startSearching] = useTransition({ timeoutMs: 200 }); */
  const map = JSON.parse(data, reviver);
  return (
    <div className="max-h-screen-header flex w-full max-w-sm flex-col items-center gap-2 overflow-auto bg-white py-4 shadow-lg">
      {[...map.keys()].slice(0, 30).map((x) => (
        <ListButton key={x} counter={map.get(x).counter}>
          {x}
        </ListButton>
      ))}
    </div>
  );
};

export default PackageList;
