import type { NextPage } from "next";
import React, { createContext, useEffect, useState } from "react";
import List from "../components/List";
import { Detail, Heading, Link, Modal } from "@navikt/ds-react";
import Panel from "../components/Panel";

export type packageUsesT = {
  uses: number;
  defaultUses: number;
  namedUses: { [key: string]: { uses: number; repos: string[] } };
  fileSource: string[];
};

export const AppContext = createContext<any>(null);

const App: NextPage = () => {
  const [dataRoot, setDataRoot] = useState<any[]>([]);
  const [fileLinks, setFileLinks] = useState<string[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [activeView, setActiveView] = useState<any>(null);

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
      <div className="w-full flex">
        <AppContext.Provider
          value={{
            setFileLinks,
            setModalOpen,
            setActiveView,
            activeView,
            data: dataRoot,
          }}
        >
          <List />
          <Panel />
        </AppContext.Provider>
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <h2>Linker til filer som bruker komponent: </h2>
        {fileLinks.length === 0 && (
          <div>Klarte ikke finne lenke til bruk...</div>
        )}
        {fileLinks.map((x) => {
          const split = x.split("/");

          return (
            <div key={x}>
              <Link
                target="_blank"
                href={`https://github.com/navikt/${split[0]}/blob/master/${split
                  .slice(1)
                  .join("/")}`}
              >
                {x}
              </Link>
            </div>
          );
        })}
      </Modal>
    </div>
  );
};

export default App;
