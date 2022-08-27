import {
  Table,
  ToggleGroup
} from "@navikt/ds-react";
import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip
} from "chart.js";
import Head from "next/head";
import { useState } from "react";
import { Line } from "react-chartjs-2";
import { ImportSummaryT } from "../../crawler/parsing/react/parse-import-data";
import { getSummary } from "../../lib/get-summary";
import {
  getSummaryChart,
  getSummaryChartTotal
} from "../../lib/get-summary-chart";
import { Card } from "../package/[name]";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);


const Page = ({ name, summary, chartData, totalChart }: PropsT) => {
  const [value, setValue] = useState("info");

  function partition(list, n = 6) {
    const isPositiveInteger = Number.isSafeInteger(n) && n > 0;
    if (!isPositiveInteger) {
      throw new RangeError("n must be a positive integer");
    }

    const partitions = [];
    const partitionLength = Math.ceil(list.length / n);

    for (let i = 0; i < list.length; i += partitionLength) {
      const partition = list.slice(i, i + partitionLength);
      partitions.push(partition);
    }

    return partitions;
  }

  return (
    <>
      <Head>
        <title>{name} - NAV</title>
      </Head>
      <div className="flex max-h-screen min-h-screen overflow-auto p-12">
        <div className="flex w-full flex-col gap-6">
          <ToggleGroup size="small" defaultValue="info" onChange={setValue}>
            <ToggleGroup.Item value="info">Info</ToggleGroup.Item>
            {/* <ToggleGroup.Item value="oversikt">Filoversikt</ToggleGroup.Item> */}
            <ToggleGroup.Item value="historie">Historie</ToggleGroup.Item>
          </ToggleGroup>
          {value === "historie" && (
            <>
              <div className="relative flex w-full flex-col gap-8 overflow-scroll rounded-lg bg-white px-4 py-2 shadow-md">
                <Line data={totalChart} />
                <Line
                  data={{
                    labels: chartData.labels,
                    datasets: partition(chartData.datasets)[0],
                  }}
                />
                <Line
                  data={{
                    labels: chartData.labels,
                    datasets: partition(chartData.datasets)[1],
                  }}
                />
                <Line
                  data={{
                    labels: chartData.labels,
                    datasets: partition(chartData.datasets)[2],
                  }}
                />
                <Line
                  data={{
                    labels: chartData.labels,
                    datasets: partition(chartData.datasets)[3],
                  }}
                />
                <Line
                  data={{
                    labels: chartData.labels,
                    datasets: partition(chartData.datasets)[4],
                  }}
                />
                <Line
                  data={{
                    labels: chartData.labels,
                    datasets: partition(chartData.datasets)[5],
                  }}
                />
              </div>
            </>
          )}
          {/* {value === "oversikt" && (
            <div className="">
              <Accordion>
                <Accordion.Item>
                  <Accordion.Header>
                    Default import: {summary.summary.defaultImport.count}
                  </Accordion.Header>
                  <Accordion.Content>
                    {summary.summary.defaultImport.files.map((x) => (
                      <Link key={x} href={x}>
                        {x}
                      </Link>
                    ))}
                  </Accordion.Content>
                </Accordion.Item>
                <Accordion.Item>
                  <Accordion.Header>
                    Namespace import: {summary.summary.nameSpaceImport.count}
                  </Accordion.Header>
                  <Accordion.Content>
                    {summary.summary.nameSpaceImport.files.map((x) => (
                      <Link key={x} href={x}>
                        {x}
                      </Link>
                    ))}
                  </Accordion.Content>
                </Accordion.Item>
              </Accordion>
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
                {summary.summary.namedImport
                  .sort((a, b) => b.count - a.count)
                  .map((x, y) => (
                    <Table.Row key={x.name}>
                      <Table.HeaderCell scope="row">{x.name}</Table.HeaderCell>
                      <Table.DataCell className="text-right">
                        {x.count}
                      </Table.DataCell>
                    </Table.Row>
                  ))}
              </Table.Body>
            </Table>
            </div>
          )} */}
          {value === "info" && (
            <>
              <div className="flex min-w-[250px] flex-col w-fit flex-wrap gap-4">
                <Card
                  desc="Antall imports"

                >
                  {summary.count}
                </Card>
                <Card
                  desc="Brukt i x repo"

                >
                  {summary.repo.length}
                </Card>
              </div>
              <div className="mt-8 flex flex-col min-w-[250px] w-fit max-w-2xl flex-wrap gap-4">
                <Card desc="Default imports" >
                  {summary.summary.defaultImport.count}
                </Card>
                <Card desc="Namespace import" >
                  {summary.summary.nameSpaceImport.count}
                </Card>
                <Card desc="Total named import" >
                  {summary.summary.namedImport.reduce(
                    (old, v) => old + v.count,
                    0
                  )}
                </Card>
              </div>
            </>
          )}
        </div>
        {value === "info" && (
          <div className="relative w-full max-w-lg overflow-scroll rounded-lg bg-white px-4 py-2 shadow-md">
            <Table size="small" className="overflow-scroll">
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell scope="col">Navn</Table.HeaderCell>
                  <Table.HeaderCell scope="col" className="text-right">
                    Antall
                  </Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {summary.summary.namedImport
                  .sort((a, b) => b.count - a.count)
                  ?.map((x, y) => (
                    <Table.Row key={x.name}>
                      <Table.HeaderCell scope="row">{x.name}</Table.HeaderCell>
                      <Table.DataCell className="text-right">
                        {x.count}
                      </Table.DataCell>
                    </Table.Row>
                  ))}
              </Table.Body>
            </Table>
          </div>
        )}
      </div>
    </>
  );
};

export default Page;

export async function getStaticPaths() {
  return {
    paths: [
      { params: { name: "@navikt__ds-react" } },
      { params: { name: "@navikt__ds-react-internal" } },
      { params: { name: "@navikt__ds-icons" } },
    ],
    fallback: false,
  };
}

type PropsT = {
  name: string;
  summary: ImportSummaryT;
  chartData: any;
  totalChart: any;
};

export async function getStaticProps(ctx): Promise<{ props: PropsT }> {
  const name = ctx.params.name.replace("__", "/");
  return {
    props: {
      name,
      summary: getSummary(name),
      chartData: getSummaryChart(name),
      totalChart: getSummaryChartTotal(name),
    },
  };
}
