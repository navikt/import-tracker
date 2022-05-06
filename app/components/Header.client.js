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
                searchTags: rest?.searchTags
                  ? [
                      ...rest?.searchTags,
                      document.getElementById("searchfieldid").value,
                    ]
                  : [document.getElementById("searchfieldid").value],
              });
            });

            document.getElementById("searchfieldid").value = "";
          }}
        >
          <Search
            size="small"
            id="searchfieldid"
            label="Søk i pakkenavn"
            variant="secondary"
          />
        </form>
      </div>
      {isSearching && <Loader variant="inverted" />}
      <div className="my-auto ml-2 flex flex-wrap gap-2 py-2">
        {rest.searchTags?.map((x) => (
          <Tag key={x} tags={[...rest.searchTags]} {...rest}>
            {x}
          </Tag>
        ))}
      </div>
      <Heading level="1" size="small" className="my-auto ml-auto px-8">
        Dependency oversikt NAV IT
      </Heading>
    </DsHeader>
  );
};

const Tag = ({ children, tags, ...rest }) => {
  const refresh = useRefreshRoot();
  return (
    <button
      onClick={() =>
        refresh({
          ...rest,
          searchTags: [...tags.filter((x) => x !== children)],
        })
      }
      className="focus:shadow-focus-inverted flex items-center gap-2 rounded-sm bg-gray-50/30 px-2 hover:bg-gray-50/20 focus:outline-none"
    >
      {children}
      <svg
        width="1em"
        height="1em"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M21 4.38462L13.3846 12L21 19.6154L19.6154 21L12 13.3846L4.38462 21L3 19.6154L10.6154 12L3 4.38462L4.38462 3L12 10.6154L19.6154 3L21 4.38462Z"
          fill="currentColor"
        />
      </svg>
    </button>
  );
};

export default Header;
