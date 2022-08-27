import { Close } from "@navikt/ds-icons";
import {
  Button,
  Detail,
  Heading,
  Link,
  Popover,
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
import React, { forwardRef, useRef, useState } from "react";
import { Line } from "react-chartjs-2";
import { getChartData } from "../../lib/get-chartdata";
import { getDataPoints } from "../../lib/get-datapoints";
import { getPages } from "../../lib/get-pages";
import { getVersions } from "../../lib/get-versions";
import cl from "classnames";

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

type CardT = { children: React.ReactNode; desc: any };

interface CardButtonT extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  desc: any;
}

/* eslint-disable react/display-name */
export const Card = forwardRef<HTMLDivElement, CardT>(
  ({ children, desc, ...rest }, ref) => {
    return (
      <div {...rest} ref={ref} className="bg-white py-2 px-4">
        <Detail className="flex justify-between">
          {`${desc}: `}
          <span className="text-text font-semibold">{`${children}`}</span>
        </Detail>
      </div>
    );
  }
);

export const CardButton = forwardRef<HTMLButtonElement, CardButtonT>(
  ({ children, desc, ...rest }, ref) => {
    return (
      <button {...rest} ref={ref} className="bg-white py-2 focus:z-10 px-4 w-full focus:shadow-focus focus:outline-none">
        <Detail className="flex justify-between">
          {`${desc}: `}
          <span className="text-text font-semibold">{`${children}`}</span>
        </Detail>
      </button>
    );
  }
);

const Versions = ({ data }: any) => {
  const [open, setOpen] = useState(false);
  const [anchor, setAnchor] = useState(null);

  return (
    <div>
      <CardButton ref={setAnchor} desc={data.version} onClick={() => setOpen(true)}>
        {data.n}
      </CardButton>
      {open && (
        <Popover
          anchorEl={anchor}
          open={open}
          onClose={() => setOpen(false)}
          arrow={false}
          placement="right"
          className="max-h-screen overflow-y-auto"
        >
          <Popover.Content>
          <div>
            <Heading level="3" size="xsmall">
              Repos
            </Heading>
            <ul>
              {data.repos
                .filter((value, index, array) => array.indexOf(value) === index)
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
          </Popover.Content>
        </Popover>
      )}
    </div>
  );
};

const Page = ({ name, dataPoints, versions, chartData }: PackagePropsT) => {
  const [value, setValue] = useState("info");

  return (
    <>
      <Head>
        <title>{name} - NAV</title>
      </Head>
      <div
        className={cl(
          "flex max-h-screen min-h-screen flex-col gap-6 overflow-auto p-12",
          { "w-fit": value !== "historie", "w-full": value === "historie" }
        )}
      >
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
            <div className="flex max-w-2xl flex-col gap-4">
              <Card desc="Pakkebruk totalt">{dataPoints.all.current}</Card>
              <Card desc="Repos som bruker pakke">{dataPoints.reposN}</Card>
              <Card desc="Uniker versjoner">{versions.length}</Card>
            </div>
            <div className="mt-16 flex max-w-2xl flex-col gap-4">
              <Card desc="dependencies">{dataPoints.dep.current}</Card>
              <Card desc="devDependencies">{dataPoints.dev.current}</Card>
              <Card desc="peerDependencies">{dataPoints.peer.current}</Card>
            </div>
          </div>
        )}
        {value === "versjon" && (
          <div className="overflow-auto flex flex-col gap-1 px-2 py-1">
            {versions.map((x) => (
              <Versions key={x.version} data={x} />
            ))}
          </div>
        )}
        {value === "historie" && (
          <div className="relative mt-8 w-full  overflow-scroll rounded-lg bg-white px-4 py-2 shadow-md">
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
