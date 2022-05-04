import { unstable_useRefreshRoot as useRefreshRoot } from "next/streaming";
import { Loader, Select, ToggleGroup } from "@navikt/ds-react";
import React, { useTransition } from "react";

const Filter = ({ options, ...rest }) => {
  const refresh = useRefreshRoot();
  const [isSearching, startSearching] = useTransition(/* { timeoutMs: 200 } */);

  return (
    <div className="flex w-11/12 flex-col items-center gap-2 pb-2">
      <Select
        onChange={(e) =>
          startSearching(() =>
            refresh({ ...rest, selectedFile: e.target.value })
          )
        }
        size="small"
        className="w-full"
      >
        {options.map((x) => (
          <option value={x} key={x}>
            {x}
          </option>
        ))}
      </Select>
      <ToggleGroup
        size="small"
        defaultValue="all"
        onChange={(e) =>
          startSearching(() => refresh({ ...rest, selectedFilter: e }))
        }
      >
        <ToggleGroup.Item value="all">All</ToggleGroup.Item>
        <ToggleGroup.Item value="dep">Dep</ToggleGroup.Item>
        <ToggleGroup.Item value="dev">Dev</ToggleGroup.Item>
        <ToggleGroup.Item value="peer">Peer</ToggleGroup.Item>
        <ToggleGroup.Item value="90d">{`90d`}</ToggleGroup.Item>
        <ToggleGroup.Item value="180d">{`180d`}</ToggleGroup.Item>
      </ToggleGroup>
      {/* {isSearching && (
        <div className="animate-fadeIn absolute inset-0 flex items-center justify-center bg-gray-900/30">
          <Loader size="2xlarge" />
        </div>
      )} */}
    </div>
  );
};
export default Filter;
