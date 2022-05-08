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
import { ImportSummaryT } from "../../crawler/parsing/react/parse-import-data";
import { getChartData } from "../../lib/get-chartdata";
import { getDataPoints } from "../../lib/get-datapoints";
import { getPages } from "../../lib/get-pages";
import { getSummary } from "../../lib/get-summary";
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

const Page = () => {
  return (
    <>
      <Head>
        <title>Designsystem oversikt - NAV</title>
      </Head>
      <div className="flex max-h-screen min-h-screen w-full flex-col gap-6 overflow-auto p-12"></div>
    </>
  );
};

export default Page;
