import { getIndexedList } from "../../lib/get-data";
import { getDataPoints } from "../../lib/get-datapoints";
import { getPages } from "../../lib/get-pages";

export type PackagePropsT = {
  name: string;
  indexList: {
    all: { index: number | null; name: string }[];
    dep: { index: number | null; name: string }[];
    dev: { index: number | null; name: string }[];
    peer: { index: number | null; name: string }[];
  };
  dataPoints?: {
    all: { current: number; prev: number };
    dep: { current: number; prev: number };
    dev: { current: number; prev: number };
    peer: { current: number; prev: number };
    yearToDate: { current: number; prev: number };
    halfYearTrend: { current: number; prev: number };
    YearTrend: { current: number; prev: number };
  };
};

const Page = ({ name, indexList, dataPoints, ...props }: PackagePropsT) => {
  console.log(dataPoints);
  return (
    <div>
      {name}
      <div className="flex flex-col">
        {indexList.all.map((x) => (
          <button key={x.name}>{x.name}</button>
        ))}
      </div>
    </div>
  );
};

export default Page;

export async function getStaticPaths() {
  const paths = getPages();

  return {
    paths: [...paths.map((x) => ({ params: { name: x } }))],
    fallback: false,
  };
}

export async function getStaticProps(ctx): Promise<{ props: PackagePropsT }> {
  return {
    props: {
      name: ctx.params.name,
      indexList: getIndexedList(),
      dataPoints: getDataPoints(ctx.params.name),
    },
  };
}
