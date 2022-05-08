import { BodyLong, BodyShort, Heading } from "@navikt/ds-react";
import React from "react";
import { getIndexedList } from "../lib/get-data";
import { getLastUpdate } from "../lib/get-last-update";
import { getDeprecated, getPackages, getScope } from "../lib/get-packages";
import { getRepos } from "../lib/get-repos";
import { Card } from "./package/[name]";

export default function Home({
  lastUpdate,
  repos,
  packages,
  scoped,
  deprecated,
  ...rest
}) {
  return (
    <div className="flex max-h-screen min-h-screen w-full flex-col gap-4 overflow-auto p-12">
      <div className="max-w-3xl">
        <BodyShort spacing>Sist oppdatert: {lastUpdate}</BodyShort>
        <Heading spacing level="2" size="medium">
          Hva er denne appen?
        </Heading>
        <BodyLong spacing>
          Appen har sett gjennom all pakkebruk i NAVIT sine git-repo de siste
          ~24 månedene. Dataen er så oppsummert her, så velg en pakke i
          venstremenyen for å komme i gang. Planen er å oppdatere en gang hver
          måndede fremover.
        </BodyLong>
      </div>
      <Heading level="2" size="medium">
        Datakilde
      </Heading>
      <div className="mb-8 flex max-w-2xl flex-wrap gap-4">
        <Card
          desc={"Repos w/package.json"}
          src={<span className="invisible">a</span>}
        >
          {repos}
        </Card>
        <Card
          desc={"Package.json filer"}
          src={<span className="invisible">a</span>}
        >
          1484
        </Card>
        <Card
          desc={"js/ts-filer funnet"}
          src={<span className="invisible">a</span>}
        >
          56711
        </Card>
      </div>
      <Heading level="2" size="medium">
        Pakker
      </Heading>
      <div className="mb-8 flex max-w-2xl flex-wrap gap-4">
        <Card desc={"Unike pakker"} src={<span className="invisible">a</span>}>
          {packages}
        </Card>
        <Card
          desc={"Under @navikt scope"}
          src={<span className="invisible">a</span>}
        >
          {scoped}
        </Card>
        <Card
          desc={"Ikke i bruk lengre"}
          src={<span className="invisible">a</span>}
        >
          {deprecated}
        </Card>
      </div>
    </div>
  );
}

export async function getStaticProps() {
  return {
    props: {
      repos: getRepos(),
      packages: getPackages(),
      scoped: getScope(),
      deprecated: getDeprecated(),
      lastUpdate: getLastUpdate(),
    },
  };
}
