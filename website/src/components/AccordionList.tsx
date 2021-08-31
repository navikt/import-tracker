import { Accordion, Button } from "@navikt/ds-react";
import uniq from "lodash.sorteduniq";
import React, { Fragment, useContext } from "react";
import { AppContext, packageUsesT } from "../App";
import "../app.css";

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
        Importeres bare direkte, eks: `import "@navikt/ds-css"`
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

const AccordionList = ({
  imp,
}: {
  imp: {
    name: string;
    value: packageUsesT;
  };
}) => {
  return (
    <Accordion
      className="accordion filter drop-shadow-lg"
      heading={
        <span style={{ display: "flex", justifyContent: "space-between" }}>
          <span>{imp.name}</span>
          <span>{imp.value.uses}</span>
        </span>
      }
      key={imp.name}
      renderContentWhenClosed={false}
    >
      <div className="max-h-80 overflow-auto">
        <ImportTable
          key={imp.name + imp.name}
          imports={imp.value.namedUses}
          defaultImports={imp.value.defaultUses}
          files={imp.value.fileSource}
        />
      </div>
    </Accordion>
  );
};

export default AccordionList;
