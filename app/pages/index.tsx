import { BodyLong, BodyShort, Heading, Link } from "@navikt/ds-react";
import NextLink from "next/link";
import React from "react";
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
    <div className="flex max-h-screen min-h-screen w-fit flex-col gap-4 overflow-auto p-12">
      <Heading level="2" size="xsmall">
        Kilde
      </Heading>
      <div className="mb-8 flex  flex-col gap-4">
        <Card desc={"Repos w/package.json"}>{repos}</Card>
        <Card desc={"Package.json filer"}>1484</Card>
        <Card desc={"js/ts-filer funnet"}>56711</Card>
      </div>
      <Heading level="2" size="xsmall">
        Pakker
      </Heading>
      <div className="mb-8 flex max-w-2xl flex-col gap-4">
        <Card desc={"Unike pakker"}>{packages}</Card>
        <Card desc={"Under @navikt scope"}>{scoped}</Card>
        <Card desc={"Ikke i bruk lengre"}>{deprecated}</Card>
      </div>
      <NextLink href="/ds" passHref>
        <Link className="w-fit">Designsystem-komponenter</Link>
      </NextLink>
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
