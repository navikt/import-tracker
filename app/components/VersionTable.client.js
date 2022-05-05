import { Table, Heading, Link } from "@navikt/ds-react";
import { reviver } from "@/crawler/parsing/map-to-json";
import React from "react";

const VersionTable = ({ pack, ...rest }) => {
  const data = JSON.parse(pack, reviver);
  const versions = new Map(
    [...data.versions].sort((a, b) => {
      return b[1].length - a[1].length;
    })
  );

  return (
    <div className="relative w-full overflow-scroll rounded-lg bg-white px-4 py-2 shadow-md">
      <Table size="small" className="max-h-fit">
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell scope="col">Version</Table.HeaderCell>
            <Table.HeaderCell scope="col" className="text-right">
              Antall
            </Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {[...versions.entries()].map(([x, val], y) => (
            <Table.ExpandableRow
              key={x}
              togglePlacement="right"
              content={
                <div>
                  <Heading level="3" size="xsmall">
                    Repos
                  </Heading>
                  <ul>
                    {val
                      .filter(
                        (value, index, array) => array.indexOf(value) === index
                      )
                      .map((x) => (
                        <li key={x}>
                          <Link
                            className="text-text visited:text-purple-400"
                            href={`https://github.com/navikt/${x}`}
                          >
                            {x}
                          </Link>
                        </li>
                      ))}
                  </ul>
                </div>
              }
            >
              <Table.HeaderCell scope="row">{x}</Table.HeaderCell>
              <Table.DataCell className="text-right">
                {val.length}
              </Table.DataCell>
            </Table.ExpandableRow>
          ))}
        </Table.Body>
      </Table>
    </div>
  );
};
export default VersionTable;
