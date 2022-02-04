import { Button, Heading, Label, Link, Modal, Table } from "@navikt/ds-react";
import { uniq } from "lodash";
import { Fragment, useContext } from "react";
import { AppContext } from "../pages";

const ImportsModal = () => {
  const { setNamedImport, namedImport, setModalOpen, modalOpen, activeView } =
    useContext(AppContext);

  if (!namedImport) return null;

  const repos = uniq(namedImport.repos.map((x) => x.split("/")[0]));

  const formatLink = (s: string) => {
    const parts = s.split("/");
    return `${parts[0]}/.../${parts.pop()}`;
  };
  return (
    <Modal
      open={modalOpen}
      onClose={() => setModalOpen(false)}
      className="p-6 min-w-[600px]"
    >
      <Heading level="1" size="small" spacing>
        Bruk
      </Heading>
      {namedImport.repos.length === 0 && (
        <div>Klarte ikke finne lenke til bruk...</div>
      )}

      {repos
        .sort((a, b) => a.localeCompare(b))
        .map((repo) => {
          return (
            <div key={repo}>
              <Heading level="2" size="xsmall">
                {repo}
              </Heading>
              <ul className="pl-1 mb-4">
                {namedImport.repos.map((x) => {
                  const s = x.split("/");
                  return s[0] === repo ? (
                    <li>
                      <Link
                        key={x}
                        target="_blank"
                        href={`https://github.com/navikt/${s[0]}/blob/master/${s
                          .slice(1)
                          .join("/")}`}
                      >
                        {formatLink(x)}
                      </Link>
                    </li>
                  ) : null;
                })}
              </ul>
            </div>
          );
        })}
    </Modal>
  );
};
export default ImportsModal;
