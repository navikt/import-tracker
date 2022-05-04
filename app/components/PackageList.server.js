import React from "react";
import ListButton from "./ListButton.client";
import { reviver } from "../crawler/parsing/map-to-json";
import Filter from "./Filter.client";
import { Label } from "@navikt/ds-react";

const PackageList = ({ data, options, ...rest }) => {
  let map = JSON.parse(data, reviver);
  map = new Map(
    [...map].sort((a, b) => {
      return b[1].counter - a[1].counter;
    })
  );

  return (
    <div className="max-h-screen-header min-h-screen-header flex w-full max-w-sm flex-col items-center gap-2 overflow-auto bg-white py-4 shadow-lg">
      <Filter options={options} {...rest} />
      <div className="flex w-full flex-col items-center gap-2">
        {map.size === 0 && <Label>Ingen treff på søk</Label>}
        {[...map.keys()].slice(0, 30).map((x) => (
          <ListButton key={x} counter={map.get(x).counter} {...rest}>
            {x}
          </ListButton>
        ))}
      </div>
    </div>
  );
};

export default PackageList;
