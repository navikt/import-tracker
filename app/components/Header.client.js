import { unstable_useRefreshRoot as useRefreshRoot } from "next/streaming";
import { Header as DsHeader } from "@navikt/ds-react-internal";
import { Loader, Search, Heading } from "@navikt/ds-react";
import React, { useTransition } from "react";

const Header = ({ ...rest }) => {
  const refresh = useRefreshRoot();
  const [isSearching, startSearching] = useTransition(/* { timeoutMs: 200 } */);

  return (
    <DsHeader className="shadow-lg">
      <div className="my-auto w-64 px-4">
        <Search
          size="small"
          label="Søk i pakkenavn"
          variant="simple"
          onChange={(e) =>
            startSearching(() => {
              refresh({ ...rest, searchText: e });
            })
          }
          onClear={() =>
            startSearching(() => {
              refresh({ ...rest, searchText: "" });
            })
          }
        />
      </div>
      {isSearching && <Loader variant="inverted" />}
      <Heading level="1" size="small" className="my-auto ml-auto px-8">
        Dependency oversikt NAV IT
      </Heading>
    </DsHeader>
  );
};

export default Header;
