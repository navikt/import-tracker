import { Accordion } from "@navikt/ds-react";
import React, { Fragment } from "react";
import { packageUsesT } from "../App";

const ImportTable = ({
  imports,
  defaultImports,
}: {
  imports: { [key: string]: number };
  defaultImports: number;
}) => {
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
            .sort((a, b) => (a.value < b.value ? 1 : -1))
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
                      <td>{x.value}</td>
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
