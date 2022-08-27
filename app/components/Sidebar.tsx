import { Close } from "@navikt/ds-icons";
import { BodyShort, Loader, Search } from "@navikt/ds-react";
import cl from "classnames";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import RenderIfVisible from "react-render-if-visible";

export type indexListT = {
  all: { index: number | null; name: string; url: string; count: number }[];
  dep: { index: number | null; name: string; url: string; count: number }[];
  dev: { index: number | null; name: string; url: string; count: number }[];
  peer: { index: number | null; name: string; url: string; count: number }[];
};

const Sidebar = () => {
  const router = useRouter();

  const [tags, setTags] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [sourceList, setSourceList] = useState(null);
  const [list, setList] = useState(null);

  const ListMemo = useMemo(
    () => (
      <>
        {list ? (
          <>
            {list.map((x, y) => (
              <RenderIfVisible
                key={x + y}
                defaultHeight={36}
                rootElementClass="w-11/12"
                stayRendered
              >
                <NextLink prefetch={false} href={`${x.url}`} passHref>
                  <BodyShort
                    size="small"
                    as="a"
                    id={x.url}
                    className={cl(
                      "w-full scroll-m-72",
                      "focus:shadow-focus-inset flex items-center justify-between rounded-lg border-none px-2 py-2 text-left focus:outline-none",
                      {
                        "text-text-inverted bg-blue-900/60 hover:bg-blue-900/50":
                          router.asPath === x.url,
                        "bg-blue-900/10 hover:bg-blue-900/30":
                          router.asPath !== x.url,
                      }
                    )}
                  >
                    <p className="break-all">
                      {`${x.index ?? "X"}. `}
                      <span className="font-semibold">{x.name}</span>
                    </p>
                    <span>
                      <p>{x.count}</p>
                    </span>
                  </BodyShort>
                </NextLink>
              </RenderIfVisible>
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
        sourceList.all.filter(
          (x) => !!tags.find((tag) => x.name.includes(tag)) || tags.length === 0
        )
      );
  }, [tags, sourceList]);

  useEffect(() => {
    const el = document.getElementById(router.asPath);
    if (el) el.scrollIntoView();
  }, [router, tags, ListMemo]);

  return (
    <div className="flex max-h-screen min-h-screen w-full max-w-xs flex-col items-center bg-gray-50 ">
      <div className="sticky top-0 flex w-full flex-col items-center gap-2 py-4 px-8 ">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setTags((x) => [...x, search]);
            setSearch("");
          }}
          className="w-full"
        >
          <Search
            onChange={setSearch}
            value={search}
            label="Søk i pakker"
            size="small"
            variant="simple"
          />
        </form>

        <div className="flex w-full flex-wrap gap-2">
          {tags.map((x, y) => (
            <button
              className="focus:shadow-focus flex items-center justify-center gap-1 rounded border border-gray-600 py-1 px-2 hover:border-blue-100 hover:bg-blue-100 focus:outline-none"
              key={x + y}
              onClick={() => setTags((z) => z.filter((y) => y !== x))}
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
