import { Close } from "@navikt/ds-icons";
import {
  Button,
  Detail,
  Heading,
  Link,
  Table,
  ToggleGroup,
} from "@navikt/ds-react";
import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import Head from "next/head";
import NextLink from "next/link";
import { useState } from "react";
import { Line } from "react-chartjs-2";
import { getChartData } from "../../lib/get-chartdata";
import { getDataPoints } from "../../lib/get-datapoints";
import { getPages } from "../../lib/get-pages";
import { getVersions } from "../../lib/get-versions";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export type PackagePropsT = {
  name: string;
  dataPoints?: {
    all: { current: number; prev: number };
    dep: { current: number; prev: number };
    dev: { current: number; prev: number };
    peer: { current: number; prev: number };
    yearToDate: { current: number; prev: number };
    halfYearTrend: { current: number; prev: number };
    YearTrend: { current: number; prev: number };
    reposN: number;
  };
  versions: {
    version: string;
    n: number;
    repos: string[];
  }[];
  chartData: {
    labels: string[];
    datasets: {
      label: string;
      backgroundColor: string;
      borderColor: string;
      data: number[];
    }[];
  };
};

export const Card = ({ children, desc, src }) => {
  return (
    <div className="shadow-medium flex aspect-video h-28 flex-col justify-between rounded-lg bg-white px-4 py-2">
      <Detail className="text-text-muted">{desc}</Detail>
      <Heading as="span" size="medium" className="mx-auto px-8">
        {children}
      </Heading>
      {src && (
        <Detail size="small" className="text-text-muted ml-auto">
          {src}
        </Detail>
      )}
    </div>
  );
};

const Diff = ({ diff, noColor = false }) => {
  if (diff === 0) return <span>Ingen endring | 3m</span>;

  if (noColor) {
    return <>{diff > 0 ? <span>+{diff}</span> : <span>{diff}</span>}</>;
  }

  return (
    <>
      {diff > 0 ? (
        <span>
          <span className="text-green-400">+{diff}</span>
          {` | 3m`}
        </span>
      ) : (
        <span>
          <span className="text-red-400">{diff}</span>
          {` | 3m`}
        </span>
      )}
    </>
  );
};

const Page = ({ name, dataPoints, versions, chartData }: PackagePropsT) => {
  const [value, setValue] = useState("info");

  return (
    <>
      <Head>
        <title>{name} - NAV</title>
      </Head>
      <div className="flex max-h-screen min-h-screen w-full flex-col gap-6 overflow-auto p-12">
        <NextLink href="/" passHref prefetch={false}>
          <Button as="a" className="absolute top-4 right-4" variant="tertiary">
            <Close aria-hidden />
          </Button>
        </NextLink>
        <ToggleGroup size="small" defaultValue="info" onChange={setValue}>
          <ToggleGroup.Item value="info">Info</ToggleGroup.Item>
          <ToggleGroup.Item value="versjon">Versjoner</ToggleGroup.Item>
          <ToggleGroup.Item value="historie">Historie</ToggleGroup.Item>
        </ToggleGroup>
        {value === "info" && (
          <div>
            <div className="flex max-w-2xl flex-wrap gap-4">
              <Card
                desc="Pakkebruk totalt"
                src={
                  <Diff diff={dataPoints.all.current - dataPoints.all.prev} />
                }
              >
                {dataPoints.all.current}
              </Card>
              <Card
                desc="Repos som bruker pakke"
                src={<span className="invisible">A</span>}
              >
                {dataPoints.reposN}
              </Card>
              <Card
                desc="Uniker versjoner"
                src={<span className="invisible">A</span>}
              >
                {versions.length}
              </Card>
            </div>
            <div className="mt-16 flex max-w-2xl flex-wrap gap-4">
              <Card
                desc="dependencies"
                src={
                  <Diff diff={dataPoints.dep.current - dataPoints.dep.prev} />
                }
              >
                {dataPoints.dep.current}
              </Card>
              <Card
                desc="devDependencies"
                src={
                  <Diff diff={dataPoints.dev.current - dataPoints.dev.prev} />
                }
              >
                {dataPoints.dev.current}
              </Card>
              <Card
                desc="peerDependencies"
                src={
                  <Diff diff={dataPoints.peer.current - dataPoints.peer.prev} />
                }
              >
                {dataPoints.peer.current}
              </Card>
            </div>
            <div className="mt-8 flex max-w-2xl flex-wrap gap-4">
              <Card
                desc="Year to date"
                src={<span className="invisible">A</span>}
              >
                {dataPoints.yearToDate.current - dataPoints.yearToDate.prev ===
                0 ? (
                  "0"
                ) : (
                  <Diff
                    noColor
                    diff={
                      dataPoints.yearToDate.current - dataPoints.yearToDate.prev
                    }
                  />
                )}
              </Card>
              <Card
                desc="Siste 6 mnd"
                src={<span className="invisible">A</span>}
              >
                {dataPoints.halfYearTrend.current -
                  dataPoints.halfYearTrend.prev ===
                0 ? (
                  "0"
                ) : (
                  <Diff
                    noColor
                    diff={
                      dataPoints.halfYearTrend.current -
                      dataPoints.halfYearTrend.prev
                    }
                  />
                )}
              </Card>
              <Card
                desc="Siste 12 mnd"
                src={<span className="invisible">A</span>}
              >
                {dataPoints.YearTrend.current - dataPoints.YearTrend.prev ===
                0 ? (
                  "0"
                ) : (
                  <Diff
                    noColor
                    diff={
                      dataPoints.YearTrend.current - dataPoints.YearTrend.prev
                    }
                  />
                )}
              </Card>
            </div>
          </div>
        )}
        {value === "versjon" && (
          <div className="relative w-full max-w-lg overflow-scroll rounded-lg bg-white px-4 py-2 shadow-md">
            <Table size="small" className="overflow-scroll">
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell scope="col">Version</Table.HeaderCell>
                  <Table.HeaderCell scope="col" className="text-right">
                    Antall
                  </Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {versions.map((x, y) => (
                  <Table.ExpandableRow
                    key={x.version}
                    togglePlacement="right"
                    content={
                      <div>
                        <Heading level="3" size="xsmall">
                          Repos
                        </Heading>
                        <ul>
                          {x.repos
                            .filter(
                              (value, index, array) =>
                                array.indexOf(value) === index
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
                    <Table.HeaderCell scope="row">{x.version}</Table.HeaderCell>
                    <Table.DataCell className="text-right">
                      {x.n}
                    </Table.DataCell>
                  </Table.ExpandableRow>
                ))}
              </Table.Body>
            </Table>
          </div>
        )}
        {value === "historie" && (
          <div className="relative mt-8 w-full overflow-scroll rounded-lg bg-white px-4 py-2 shadow-md">
            <Line data={chartData} />
          </div>
        )}
        {value === "info" && (
          <div className="mb-4 flex w-fit flex-col">
            <Link
              className="text-text"
              href={`https://www.npmjs.com/package/${name}`}
            >{`npmjs.com/package/${name}`}</Link>
            <Link
              className="text-text"
              href={`https://bundlephobia.com/package/${name}`}
            >{`bundlephobia.com/package/${name}`}</Link>
          </div>
        )}
      </div>
    </>
  );
};

export default Page;

export async function getStaticPaths() {
  const paths = getPages();

  return {
    paths: [
      ...paths.map((x) => ({
        params: { name: x.replace("/", "__") },
      })),
    ],
    fallback: false,
  };
}

export async function getStaticProps(ctx): Promise<{ props: PackagePropsT }> {
  const name = ctx.params.name.replace("__", "/");
  return {
    props: {
      name: decodeURI(name),
      dataPoints: getDataPoints(name),
      versions: getVersions(name),
      chartData: getChartData(name),
    },
  };
}
