import React, {useEffect, useState} from "react";
import "./app.css";
import {Accordion} from "@navikt/ds-react";
import {Checkbox, Input, SkjemaGruppe} from "nav-frontend-skjema";
import Etikett from "nav-frontend-etiketter";
import {SuccessStroke} from "@navikt/ds-icons";
import InfiniteScroll from "react-infinite-scroller";

type packageUsesT = {
  uses: number;
  defaultUses: number;
  namedUses: {[key: string]: number};
};

const App = () => {
  const [loadCount, setLoadCount] = useState<number>(1);
  const [showLocal, setShowLocal] = useState(false);
  const [inputText, setInputText] = useState("");
  const [error, setError] = useState<string | undefined>();
  const [tags, setTags] = useState<string[]>([]);
  const [data, setData] = useState<{name: string; value: packageUsesT}[]>([]);
  const [dataRoot, setDataRoot] = useState<{name: string; value: packageUsesT}[]>([]);
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
        const parsed = Object.keys(data).map((key) => {
          return {name: key, value: data[key] as packageUsesT};
        });
        setDataRoot(parsed);
        setData([...parsed.slice(0, 40)]);
      });
  }, []);

  useEffect(() => {}, [data]);

  useEffect(() => {
    const filterImports = (s: string) => {
      if (tags.length === 0) {
        return true;
      }
      return tags.find((tag) => s.toLowerCase().indexOf(tag.toLowerCase()) !== -1);
    };

    const filtered = dataRoot.filter((imp) => {
      if (filterImports(imp.name)) {
        return true;
      } else if (
        Object.keys(imp.value.namedUses).length > 0 &&
        Object.keys(imp.value.namedUses).findIndex((x) => filterImports(x)) !== -1
      ) {
        return true;
      }
      return false;
    });

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
  }, [loadCount, tags, dataRoot, hasMore]);

  const removeTag = (x: number) => setTags([...tags.filter((_, i) => i !== x)]);

  const imports = data.map((imp, y) => (
    <Accordion
      className="accordion"
      heading={
        <span style={{display: "flex", justifyContent: "space-between"}}>
          <span>{imp.name}</span>
          <span>{imp.value.uses}</span>
        </span>
      }
      key={y + imp.name}
    >
      {imp.value.defaultUses === 0 ? (
        <span>
          Importeres antageligvis i et av formatene <br />{" "}
          <code>{`import "${imp.name}";`}</code> <br />
          <code>{`const Package = require("${imp.name}");`}</code>
        </span>
      ) : (
        <h4>Default Imports: {`${imp.value.defaultUses}`}</h4>
      )}

      {Object.keys(imp.value.namedUses).length > 0 && (
        <>
          <h4>Named imports:</h4>
          <ul>
            {Object.keys(imp.value.namedUses).map((key, i) => (
              <li key={key + i}>{`${key}: ${imp.value.namedUses[key]}`}</li>
            ))}
          </ul>
        </>
      )}
    </Accordion>
  ));

  return (
    <div className="app">
      <div className="content">
        <form onSubmit={handleSubmit}>
          <SkjemaGruppe>
            <Input
              id="import-input"
              onChange={(e) => setInputText(e.target.value)}
              label="Import/Pakke navn"
              description={`Eks: react, nextjs/router, useState`}
              feil={error}
            />
            <div className="tags">
              {tags.map((tag, x) => (
                <Etikett
                  key={tag + x}
                  onClick={() => removeTag(x)}
                  className="tag"
                  type="info"
                >
                  <SuccessStroke />
                  <span>{tag}</span>
                </Etikett>
              ))}
            </div>
            <Checkbox
              label="Vis lokal-imports"
              onChange={() => setShowLocal(!showLocal)}
            />
          </SkjemaGruppe>
        </form>
        <InfiniteScroll
          pageStart={1}
          initialLoad={false}
          loadMore={setLoadCount}
          hasMore={hasMore}
          loader={<div key={"loading"}>Loading...</div>}
          className="infinitescroll"
        >
          {imports}
        </InfiniteScroll>
      </div>
    </div>
  );
};

export default App;
