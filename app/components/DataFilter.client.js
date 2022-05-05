import { ToggleGroup, Loader } from "@navikt/ds-react";
import { unstable_useRefreshRoot as useRefreshRoot } from "next/streaming";
import React, { useTransition } from "react";

const DataFilter = ({ options, ...rest }) => {
  const refresh = useRefreshRoot();
  const [isSearching, startSearching] = useTransition(/* { timeoutMs: 200 } */);

  return (
    <div className="flex w-11/12 flex-col items-center gap-2 pb-2">
      <ToggleGroup
        className="toggleGroup"
        size="small"
        value={rest?.dataFilter ?? "default"}
        onChange={(e) =>
          startSearching(() => refresh({ ...rest, dataFilter: e }))
        }
      >
        <ToggleGroup.Item value="default">Versjoner</ToggleGroup.Item>
        <ToggleGroup.Item value="history">Historie</ToggleGroup.Item>
      </ToggleGroup>
      <style jsx global>
        {`
          :root {
            --navds-toggle-group-color-background-pressed: rgba(0, 34, 82, 0.6);
          }
        `}
      </style>
      {isSearching && (
        <div className="animate-fadeIn absolute inset-0 flex items-center justify-center bg-gray-900/30">
          <Loader size="2xlarge" />
        </div>
      )}
    </div>
  );
};
export default DataFilter;
