import { Accordion, Button, Link, Modal } from "@navikt/ds-react";
import React, { Fragment, useState } from "react";
import { packageUsesT } from "../App";
import "../app.css";

const ImportTable = ({
  imports,
  defaultImports,
}: {
  imports: { [key: string]: { uses: number; repos: string[] } };
  defaultImports: number;
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalFiles, setModalFiles] = useState<string[]>([]);
  const handleModal = (files: string[]) => {
    setModalFiles(files);
    setModalOpen(true);
  };

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
            <td>{defaultImports}</td>
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
                      <td
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
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
      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        {modalFiles.map((x) => {
          const split = x.split("/");
          return (
            <div key={x}>
              <Link
                target="_blank"
                href={`https://github.com/navikt/${split[0]}/blob/master/${split[1]}`}
              >
                {x}
              </Link>
            </div>
          );
        })}
      </Modal>
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
        {imp.value.defaultUses > 0 &&
          Object.keys(imp.value.namedUses).length === 0 && (
            <span>
              Importeres antageligvis i formatene <br /> <br />
              <code>{`const Package = require("${imp.name}");`}</code>
              <br />
              <br />
              <code>{`import "${imp.name}";`}</code>
            </span>
          )}

        {Object.keys(imp.value.namedUses).length > 0 && (
          <ImportTable
            key={imp.name + imp.name}
            imports={imp.value.namedUses}
            defaultImports={imp.value.defaultUses}
          />
        )}
      </div>
    </Accordion>
  );
};

export default AccordionList;
