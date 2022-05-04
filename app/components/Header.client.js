import { unstable_useRefreshRoot as useRefreshRoot } from "next/streaming";
import { Header as DsHeader } from "@navikt/ds-react-internal";
import { Loader, Search } from "@navikt/ds-react";
import React, { useTransition } from "react";

const Header = () => {
  const refresh = useRefreshRoot();
  const [isSearching, startSearching] = useTransition({ timeoutMs: 200 });

  return (
    <DsHeader>
      <DsHeader.Title>Import tracker</DsHeader.Title>
      <div className="my-auto w-64 px-4">
        <Search
          size="small"
          label="Søk i pakkenavn"
          variant="simple"
          onChange={(e) => {
            startSearching(() => {
              refresh({ searchText: e });
            });
          }}
          onClear={(e) => {
            startSearching(() => {
              refresh({ searchText: "" });
            });
          }}
        />
      </div>
      {isSearching && <Loader variant="inverted" />}
    </DsHeader>
  );
};

export default Header;
