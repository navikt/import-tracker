import { Next } from "@navikt/ds-icons";
import { BodyShort, Button, Detail, Label } from "@navikt/ds-react";
import uniq from "lodash.sorteduniq";
import React, { Fragment, useContext } from "react";
import { AppContext, packageUsesT } from "../pages/index";
import cl from "classnames";

const ImportTable = ({
  imports,
  defaultImports,
  files,
}: {
  imports: { [key: string]: { uses: number; repos: string[] } };
  defaultImports: number;
  files: string[];
}) => {
  const { setFileLinks, setModalOpen } = useContext(AppContext);

  const handleModal = (files: string[]) => {
    console.log(files);
    setFileLinks(files);
    setModalOpen(true);
  };

  if (Object.keys(imports).length === 0 && defaultImports === 0) {
    return (
      <div className="button__flex">
        Importeres direkte
        <Button onClick={() => handleModal(files)}>Se filer</Button>
      </div>
    );
  }

  const namedLinks = Object.values(imports).reduce(
    (x, y) => [...x, ...y.repos],
    [] as string[]
  );

  const defaultLinks = uniq(files.filter((x) => !namedLinks.includes(x)));

  console.log(defaultLinks);

  return (
    <>
      <table className="tabell tabell--stripet">
        <thead>
          <tr>
            <th>Funksjon/klasse</th>
            <th>Importert X ganger</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Default</td>
            <td className="button__flex">
              {defaultImports}
              <Button onClick={() => handleModal(defaultLinks)}>
                Se filer
              </Button>
            </td>
          </tr>
          {Object.keys(imports)
            .map((k) => {
              return { name: k, value: imports[k] };
            })
            .sort((a, b) => (a.value.uses < b.value.uses ? 1 : -1))
            .map((x, y) => {
              return (
                <Fragment key={x.name + y}>
                  {x.name === "*" ? (
                    <tr>
                      <td>import default as alias</td>
                      <td>{x.value}</td>
                    </tr>
                  ) : (
                    <tr>
                      <td>{x.name}</td>
                      <td className="button__flex">
                        {x.value.uses}
                        <Button onClick={() => handleModal(x.value.repos)}>
                          Se filer
                        </Button>
                      </td>
                    </tr>
                  )}
                </Fragment>
              );
            })}
        </tbody>
      </table>
    </>
  );
};

const List = () => {
  const { setActiveView, activeView, data } = useContext(AppContext);

  {
    /* <ImportTable
        key={imp.name + imp.name}
        imports={imp.value.namedUses}
        defaultImports={imp.value.defaultUses}
        files={imp.value.fileSource}
      /> */
  }

  if (!data) return null;

  return (
    <div className="max-w-xl bg-gray-900 text-gray-100 max-h-screen overflow-y-auto">
      {data.map((imp) => (
        <button
          className={cl(
            "w-full inline-flex items-center px-4 py-4 focus:outline-none",
            {
              "bg-gray-50 text-text ": activeView?.name === imp.name,
              "hover:bg-gray-800": activeView?.name !== imp.name,
            }
          )}
          onClick={() => setActiveView(imp)}
          onFocus={() => setActiveView(imp)}
        >
          <div
            className={cl(
              "inline-flex justify-between min-w-full font-semibold text-base"
            )}
          >
            <span>{imp.name}</span>
            <span className="flex gap-2 items-center">
              <span className="mr-2">{imp.value.uses}</span>
              <Next aria-hidden />
            </span>
          </div>
        </button>
      ))}
    </div>
  );
};

export default List;
