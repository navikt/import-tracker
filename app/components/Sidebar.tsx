import { Close } from "@navikt/ds-icons";
import {
  BodyShort,
  Label,
  Loader,
  Search,
  ToggleGroup,
} from "@navikt/ds-react";
import cl from "classnames";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";

export type indexListT = {
  all: { index: number | null; name: string; url: string; count: number }[];
  dep: { index: number | null; name: string; url: string; count: number }[];
  dev: { index: number | null; name: string; url: string; count: number }[];
  peer: { index: number | null; name: string; url: string; count: number }[];
};

const Sidebar = () => {
  const router = useRouter();

  const [filter, setFilter] = useState({
    type: "all",
    tags: [],
  });
  const [search, setSearch] = useState("");
  const [sourceList, setSourceList] = useState(null);
  const [list, setList] = useState(null);

  const ListMemo = useMemo(
    () => (
      <>
        {list ? (
          <>
            {list.map((x, y) => (
              <NextLink prefetch={false} key={x + y} href={`${x.url}`} passHref>
                <a
                  id={x.url}
                  className={cl(
                    "w-full scroll-m-72",
                    "focus:shadow-focus-inset flex w-11/12 items-center justify-between rounded-lg border-none  px-6 py-4 text-left focus:outline-none",
                    {
                      "text-text-inverted bg-blue-900/60 hover:bg-blue-900/50":
                        router.asPath === x.url,
                      "bg-blue-900/20 hover:bg-blue-900/30":
                        router.asPath !== x.url,
                    }
                  )}
                >
                  <Label className="break-all">
                    {`${x.index ?? "X"}. `}
                    {x.name}
                  </Label>
                  <span>
                    <Label>{x.count}</Label>
                  </span>
                </a>
              </NextLink>
            ))}
          </>
        ) : (
          <Loader size="xlarge" className="my-auto h-full" />
        )}
      </>
    ),
    [list, router]
  );

  useEffect(() => {
    fetch("/api/getSidebar")
      .then((x) => x.json())
      .then(setSourceList)
      .catch((e) => console.log(e));
  }, []);

  useEffect(() => {
    sourceList &&
      setList(
        sourceList[filter.type].filter(
          (x) =>
            !!filter.tags.find((tag) => x.name.includes(tag)) ||
            filter.tags.length === 0
        )
      );
  }, [filter, sourceList]);

  useEffect(() => {
    const el = document.getElementById(router.asPath);
    if (el) el.scrollIntoView();
  }, [router, filter, ListMemo]);

  return (
    <div className="flex max-h-screen min-h-screen w-full max-w-xs flex-col items-center bg-gray-50 shadow-lg">
      <div className="sticky top-0 flex w-full flex-col items-center gap-2 bg-white/90 py-4 px-8 shadow-lg">
        <ToggleGroup
          size="small"
          value={filter.type}
          onChange={(e) => setFilter((x) => ({ ...x, type: e }))}
        >
          <ToggleGroup.Item value="all">All</ToggleGroup.Item>
          <ToggleGroup.Item value="dep">Dep</ToggleGroup.Item>
          <ToggleGroup.Item value="dev">Dev</ToggleGroup.Item>
          <ToggleGroup.Item value="peer">Peer</ToggleGroup.Item>
        </ToggleGroup>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setFilter((x) => ({ ...x, tags: [...x.tags, search] }));
            setSearch("");
          }}
          className="w-full"
        >
          <Search
            onChange={setSearch}
            value={search}
            label="S??k i pakker"
            size="small"
            variant="simple"
          />
        </form>

        <div className="flex w-full flex-wrap gap-2">
          {filter.tags.map((x, y) => (
            <button
              className="focus:shadow-focus flex items-center justify-center gap-1 rounded border border-gray-600 py-1 px-2 hover:border-blue-100 hover:bg-blue-100 focus:outline-none"
              key={x + y}
              onClick={() =>
                setFilter((z) => ({
                  ...z,
                  tags: z.tags.filter((y) => y !== x),
                }))
              }
            >
              <BodyShort size="small">{x}</BodyShort>
              <Close aria-hidden className="text-sm" />
            </button>
          ))}
        </div>
      </div>
      <div className="flex h-full w-full flex-col items-center gap-2 overflow-auto pt-4 pb-2">
        {ListMemo}
      </div>
    </div>
  );
};

export default Sidebar;
