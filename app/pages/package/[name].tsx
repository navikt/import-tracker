import { getChartData } from "../../lib/get-chartdata";
import { getIndexedList } from "../../lib/get-data";
import { getDataPoints } from "../../lib/get-datapoints";
import { getPages } from "../../lib/get-pages";
import { getVersions } from "../../lib/get-versions";

export type indexListT = {
  all: { index: number | null; name: string; url: string; count: number }[];
  dep: { index: number | null; name: string; url: string; count: number }[];
  dev: { index: number | null; name: string; url: string; count: number }[];
  peer: { index: number | null; name: string; url: string; count: number }[];
};

export type PackagePropsT = {
  name: string;
  indexList: indexListT;
  dataPoints?: {
    all: { current: number; prev: number };
    dep: { current: number; prev: number };
    dev: { current: number; prev: number };
    peer: { current: number; prev: number };
    yearToDate: { current: number; prev: number };
    halfYearTrend: { current: number; prev: number };
    YearTrend: { current: number; prev: number };
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

const Page = ({ name, indexList, dataPoints, ...props }: PackagePropsT) => {
  return <div>{name}</div>;
};

export default Page;

export async function getStaticPaths() {
  const paths = getPages();

  return {
    paths: [...paths.map((x) => ({ params: { name: x.replace("/", "-") } }))],
    fallback: false,
  };
}

export async function getStaticProps(ctx): Promise<{ props: PackagePropsT }> {
  return {
    props: {
      name: ctx.params.name,
      indexList: getIndexedList(),
      dataPoints: getDataPoints(ctx.params.name),
      versions: getVersions(ctx.params.name),
      chartData: getChartData(ctx.params.name),
    },
  };
}
