import React, { useEffect, useState } from "react";
import "./app.css";
import { Checkbox, Input, SkjemaGruppe } from "nav-frontend-skjema";
import { SuccessStroke } from "@navikt/ds-icons";
import InfiniteScroll from "react-infinite-scroller";
import "nav-frontend-tabell-style";
import AccordionList from "./components/Accordion";
import { Element, Undertekst } from "nav-frontend-typografi";

export type packageUsesT = {
  uses: number;
  defaultUses: number;
  namedUses: { [key: string]: number };
};

const App = () => {
  const [loadCount, setLoadCount] = useState<number>(1);
  const [showLocal, setShowLocal] = useState(false);
  const [inputText, setInputText] = useState("");
  const [error, setError] = useState<string | undefined>();
  const [tags, setTags] = useState<string[]>([]);
  const [hits, setHits] = useState(0);
  const [data, setData] = useState<{ name: string; value: packageUsesT }[]>([]);
  const [dataRoot, setDataRoot] = useState<
    { name: string; value: packageUsesT }[]
  >([]);
  const [hasMore, setHasMore] = useState(true);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (inputText === "") {
      setError("Import navn må være på minst 1 tegn.");
      return;
    } else {
      setError(undefined);
    }
    setTags([...tags, inputText]);
    setInputText("");
    (document.getElementById("import-input") as HTMLInputElement).value = "";
  };

  useEffect(() => {
    fetch("imports.json", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })
      .then((data: Response) => data.json())
      .then((data: any) => {
        const parsed = Object.keys(data)
          .map((key) => {
            return { name: key, value: data[key] as packageUsesT };
          })
          .sort((x, y) => (x.value.uses < y.value.uses ? 1 : -1));
        setDataRoot(parsed);
        setData([...parsed.slice(0, 40)]);
      });
  }, []);

  useEffect(() => {
    const filterImports = (s: string) => {
      if (tags.length === 0) {
        return true;
      }
      return tags.find(
        (tag) => s.toLowerCase().indexOf(tag.toLowerCase()) !== -1
      );
    };

    const filtered = dataRoot
      .filter((imp) => {
        if (filterImports(imp.name)) {
          return true;
        } else if (
          Object.keys(imp.value.namedUses).length > 0 &&
          Object.keys(imp.value.namedUses).findIndex((x) =>
            filterImports(x)
          ) !== -1
        ) {
          return true;
        }

        return false;
      })
      .filter((x) =>
        showLocal
          ? true
          : !["./", ".."].find((y) => x.name.startsWith(y)) || x.name === "."
      );

    setHits(filtered.length);

    let max;
    if (filtered.length < loadCount * 40) {
      max = filtered.length;
      setHasMore(false);
    } else {
      max = loadCount * 40;
      !hasMore && setHasMore(true);
    }
    const newData = [...filtered.slice(0, max)].sort((x, y) =>
      x.value.uses < y.value.uses ? 1 : -1
    );
    setData(newData);
  }, [loadCount, tags, dataRoot, hasMore, showLocal]);

  const removeTag = (x: number) => setTags([...tags.filter((_, i) => i !== x)]);

  return (
    <div className="flex justify-center vw-100 typo-normal overflow-x-hidden">
      <div className="p-8 max-w-screen-md w-full">
        <form onSubmit={handleSubmit}>
          <SkjemaGruppe>
            <Input
              id="import-input"
              onChange={(e) => setInputText(e.target.value)}
              label="Import/Pakke navn"
              description={`Eks: react, nextjs/router, useState`}
              feil={error}
              autoComplete="off"
            />
            <div className="flex flex-wrap gap-x-2 gap-y-1 mb-4">
              {tags.map((tag, x) => (
                <span
                  key={tag + x}
                  onClick={() => removeTag(x)}
                  className="border-blue-600 border bg-blue-200 rounded-sm px-2 py-1 flex gap-x-1 items-center hover:bg-blue-500 hover:text-white active:bg-blue-900"
                >
                  <SuccessStroke />
                  <span>{tag}</span>
                </span>
              ))}
            </div>
            <Checkbox
              label="Vis lokale imports"
              onChange={() => setShowLocal(!showLocal)}
            />
          </SkjemaGruppe>
        </form>
        <span className="flex justify-between p-4 ">
          <Element>Pakkenavn</Element>
          {<Undertekst>Treff: {hits}</Undertekst>}
          <Element className="mx-4">Imports</Element>
        </span>
        <InfiniteScroll
          pageStart={1}
          initialLoad={false}
          loadMore={setLoadCount}
          hasMore={hasMore}
          loader={<div key={"loading"}>Loading...</div>}
          className="infinitescroll"
        >
          {data.map((imp, y) => (
            <AccordionList key={imp.name} imp={imp} />
          ))}
        </InfiniteScroll>
      </div>
    </div>
  );
};

export default App;
