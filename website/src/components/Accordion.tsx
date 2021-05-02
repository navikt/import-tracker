import { Accordion } from "@navikt/ds-react";
import React from "react";
import { packageUsesT } from "../App";

const namedImports = (
  imports: { [key: string]: number },
  defaultImports: number
) => {
  return (
    <table className="tabell">
      <thead>
        <tr>
          <th>Funksjon/klasse</th>
          <th>X ganger importert</th>
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
          .map((x) => {
            return (
              <>
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
              </>
            );
          })}
      </tbody>
    </table>
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
    >
      <div className="max-h-96 overflow-auto ">
        {imp.value.defaultUses === 0 && (
          <span>
            Importeres antageligvis i et av formatene <br />{" "}
            <code>{`import "${imp.name}";`}</code> <br />
            <code>{`const Package = require("${imp.name}");`}</code>
          </span>
        )}

        {Object.keys(imp.value.namedUses).length > 0 &&
          namedImports(imp.value.namedUses, imp.value.defaultUses)}
      </div>
    </Accordion>
  );
};

export default AccordionList;
