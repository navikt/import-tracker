import type { NextPage } from "next";
import Head from "next/head";
import React, { createContext, useEffect, useState } from "react";
import List from "../components/List";
import ImportsModal from "../components/Modal";
import Panel from "../components/Panel";

export type packageUsesT = {
  uses: number;
  defaultUses: number;
  namedUses: { [key: string]: { uses: number; repos: string[] } };
  fileSource: string[];
};

export const AppContext = createContext<{
  activeView: { name: string; value: packageUsesT };
  setActiveView: React.Dispatch<any>;
  setNamedImport: React.Dispatch<
    React.SetStateAction<{
      name: string;
      uses: number;
      repos: string[];
    }>
  >;
  namedImport: { name: string; uses: number; repos: string[] };
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  modalOpen: boolean;
  data: any[];
}>(null);

const App: NextPage = () => {
  const [dataRoot, setDataRoot] = useState<any[]>([]);
  const [namedImport, setNamedImport] =
    useState<{ name: string; uses: number; repos: string[] }>(null);
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
    <>
      <Head>
        <title>Imports DS</title>
        <link rel="icon" href="/favicon-32x32.png" />
      </Head>
      <div className="flex justify-center vw-100 typo-normal overflow-x-hidden">
        <div className="w-full flex">
          <AppContext.Provider
            value={{
              setNamedImport,
              namedImport,
              modalOpen,
              setModalOpen,
              setActiveView,
              activeView,
              data: dataRoot,
            }}
          >
            <List />
            <Panel />
            <ImportsModal />
          </AppContext.Provider>
        </div>
      </div>
    </>
  );
};

export default App;
