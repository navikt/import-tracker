import React, { useEffect, useState } from "react";
import "./app.css";
import "nav-frontend-tabell-style";
import AccordionList from "./components/AccordionList";
import { Element } from "nav-frontend-typografi";

export type packageUsesT = {
  uses: number;
  defaultUses: number;
  namedUses: { [key: string]: { uses: number; repos: string[] } };
};

const App = () => {
  const [dataRoot, setDataRoot] = useState<any[]>([]);

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
        setDataRoot(parsed.filter((x) => x.name.startsWith("@navikt/ds-")));
      });
  }, []);

  return (
    <div className="flex justify-center vw-100 typo-normal overflow-x-hidden">
      <div className="p-8 max-w-screen-md w-full">
        <span className="flex justify-between p-4 ">
          <Element>Pakkenavn</Element>
          <Element className="mx-4">Imports</Element>
        </span>
        {dataRoot.map((imp, y) => (
          <AccordionList key={imp.name} imp={imp} />
        ))}
      </div>
    </div>
  );
};

export default App;
