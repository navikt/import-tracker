import { unstable_useRefreshRoot as useRefreshRoot } from "next/streaming";
import { Header as DsHeader } from "@navikt/ds-react-internal";
import { Loader, Search, Heading } from "@navikt/ds-react";
import React, { useTransition } from "react";

const Header = ({ ...rest }) => {
  const refresh = useRefreshRoot();
  const [isSearching, startSearching] = useTransition();

  return (
    <DsHeader className="shadow-lg">
      <div className="my-auto w-64 px-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            startSearching(() => {
              refresh({
                ...rest,
                searchText: document.getElementById("searchfieldid").value,
              });
            });
          }}
        >
          <Search
            size="small"
            id="searchfieldid"
            label="Søk i pakkenavn"
            variant="secondary"
            onClear={() =>
              startSearching(() => {
                refresh({
                  ...rest,
                  searchText: "",
                });
              })
            }
          />
        </form>
      </div>
      {isSearching && <Loader variant="inverted" />}
      <Heading level="1" size="small" className="my-auto ml-auto px-8">
        Dependency oversikt NAV IT
      </Heading>
    </DsHeader>
  );
};

export default Header;
