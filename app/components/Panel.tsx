import { Close } from "@navikt/ds-icons";
import { BodyLong, Button, Heading } from "@navikt/ds-react";
import { useContext } from "react";
import { AppContext } from "../pages";

const Panel = () => {
  const { setActiveView, activeView } = useContext(AppContext);
  return (
    <>
      <div className="bg-gray-50 w-full p-4 min-w-[400px] relative">
        {activeView ? (
          <>
            <Button
              variant="tertiary"
              className="absolute top-2 right-2"
              onClick={() => setActiveView(null)}
            >
              <Close aria-hidden />
            </Button>
            <Heading size="small" level="2">
              {activeView?.name}
            </Heading>
          </>
        ) : (
          <div className="max-w-xl">
            <Heading size="small" level="2" spacing>
              Import tracker
            </Heading>
            <BodyLong spacing>
              Crawler relevante repoer i Navikt-org på github for imports i
              frontend-filer og viser relevant info fra dem.
            </BodyLong>
            <BodyLong>
              Løsningen oppdateres manuelt for nå, men er planer om å få
              prosjektet opp på NAIS etterhvert.
            </BodyLong>
          </div>
        )}
      </div>
    </>
  );
};

export default Panel;
