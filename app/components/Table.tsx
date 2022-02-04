import { Button, Label, Link, Table } from "@navikt/ds-react";
import { uniq } from "lodash";
import { Fragment, useContext, useEffect, useState } from "react";
import { AppContext } from "../pages";

const ImportTable = () => {
  const { setNamedImport, setModalOpen, activeView } = useContext(AppContext);

  const [named, setNamed] = useState<
    { name: string; uses: number; repos: string[] }[]
  >([]);

  const handleModal = (i: number) => {
    setNamedImport(named[i]);
    setModalOpen(true);
  };

  useEffect(() => {
    setNamed(
      Object.entries(activeView.value.namedUses)
        .reduce((old, [k, v]) => [...old, { name: k, ...v }], [])
        .sort((a, b) => b.uses - a.uses)
    );
  }, [activeView]);

  const makeLink = (s: string) => {
    const parts = s.split("/");
    return `https://github.com/navikt/${parts[0]}/blob/master/${parts
      .slice(1)
      .join("/")}`;
  };

  const formatLink = (s: string) => {
    const parts = s.split("/");
    return `${parts[0]}/.../${parts.pop()}`;
  };

  /*   const defaultLinks = uniq(files.filter((x) => !namedLinks.includes(x)));
   */
  if (!activeView) return null;
  return (
    <>
      {named.length !== 0 ? (
        <Table className="mt-16">
          <Table.Header>
            <Table.HeaderCell>Named import</Table.HeaderCell>
            <Table.HeaderCell>Brukt</Table.HeaderCell>
          </Table.Header>
          <Table.Body>
            {named.map((n, i) => (
              <Table.Row key={n.name}>
                <Table.DataCell>{n.name}</Table.DataCell>
                <Table.DataCell className="relative">
                  {n.uses}
                  <Button
                    className="ml-auto absolute right-0 top-1"
                    variant="tertiary"
                    onClick={() => handleModal(i)}
                  >
                    Filer
                  </Button>
                </Table.DataCell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      ) : (
        <>
          <Label spacing className="mt-16" size="small">
            Pakken har ingen named imports, men er brukt her:
          </Label>
          {activeView.value.fileSource.length !== 0 && (
            <ul>
              {uniq(activeView.value.fileSource).map((x) => (
                <li key={x}>
                  <Link
                    href={makeLink(x)}
                    className="no-underline visited:text-purple-500"
                  >
                    {x.length > 30 ? formatLink(x) : x}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </>
  );
};
export default ImportTable;
