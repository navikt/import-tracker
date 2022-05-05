import React from "react";
import { reviver, replacer } from "@/crawler/parsing/map-to-json";
import { Detail, Label, Heading } from "@navikt/ds-react";
import FindPrevRes from "./FindPrevResult.server";
import VersionTable from "./VersionTable.client";
import HistoryTable from "./HistoryChart.client";
import DataFilter from "./DataFilter.client";

const Card = ({ desc, content, src }) => {
  return (
    <div className="flex aspect-video h-28 flex-col justify-between rounded-lg bg-white px-4 py-2 shadow-md">
      <Detail className="text-text-muted">{desc}</Detail>
      <Heading as="span" size="medium" className="mx-auto px-8">
        {content}
      </Heading>
      {src && (
        <Detail size="small" className="text-text-muted ml-auto">
          {src}
        </Detail>
      )}
    </div>
  );
};

const Dataview = ({ data, fileName, options, files, ...rest }) => {
  const map = JSON.parse(data, reviver);
  const curFile = JSON.parse(
    JSON.stringify(files.find((x) => x.name === fileName)),
    reviver
  );

  if (!rest?.selectedPackage || !map.get(rest?.selectedPackage)) {
    return (
      <div className="min-h-screen-header item-center flex h-full w-full flex-col justify-center bg-blue-900/10">
        <Label className="text-text-muted w-full items-center text-center">
          Velg en pakke
        </Label>
      </div>
    );
  }

  const pack = map.get(rest?.selectedPackage);

  const curIndex = files.findIndex((x) => x.name === fileName);
  let prevResults;

  if (files.length > curIndex + 1) {
    const map = JSON.parse(JSON.stringify(files[curIndex + 1].data), reviver);
    const getPrevRes = (key) => {
      return map[key].get(rest?.selectedPackage);
    };

    prevResults = [
      "packages",
      "packagesDeps",
      "packagesDevDeps",
      "packagesPeerDeps",
      "last90",
      "last180",
    ].reduce(
      (old, key) => ({
        ...old,
        [key]: getPrevRes(key),
      }),
      {}
    );
  }

  return (
    <div className="min-h-screen-header max-h-screen-header item-start flex h-full w-full flex-col justify-start gap-6 overflow-auto bg-blue-900/10 py-6 px-12 ">
      <DataFilter />
      {rest.dataFilter !== "history" ? (
        <div className="item-start flex h-full max-h-[75vh] w-full flex-row gap-6">
          <div className="flex flex-col gap-12">
            <div className="flex flex-wrap gap-4">
              <Card
                desc="Totalt"
                content={<span>{`${pack.counter}`}</span>}
                src={
                  <FindPrevRes
                    prevCounter={prevResults?.packages.counter}
                    currentCount={pack.counter}
                  />
                }
              />
              <Card
                desc="N i dependencies"
                content={
                  <span>{`${
                    curFile?.data.packagesDeps.get(rest?.selectedPackage)
                      .counter
                  }`}</span>
                }
                src={
                  <FindPrevRes
                    prevCounter={prevResults?.packagesDeps.counter}
                    currentCount={
                      curFile?.data.packagesDeps.get(rest?.selectedPackage)
                        .counter
                    }
                  />
                }
              />
              <Card
                desc="N i devDependencies"
                content={
                  <span>{`${
                    curFile?.data.packagesDevDeps.get(rest?.selectedPackage)
                      .counter
                  }`}</span>
                }
                src={
                  <FindPrevRes
                    prevCounter={prevResults?.packagesDevDeps.counter}
                    currentCount={
                      curFile?.data.packagesDevDeps.get(rest?.selectedPackage)
                        .counter
                    }
                  />
                }
              />
              <Card
                desc="N i peerDependencies"
                content={
                  <span>{`${
                    curFile?.data.packagesPeerDeps.get(rest?.selectedPackage)
                      .counter
                  }`}</span>
                }
                src={
                  <FindPrevRes
                    prevCounter={prevResults?.packagesPeerDeps.counter}
                    currentCount={
                      curFile?.data.packagesPeerDeps.get(rest?.selectedPackage)
                        .counter
                    }
                  />
                }
              />
            </div>

            <div className="flex flex-wrap gap-4">
              <Card
                desc="Pushet < 90 dager"
                content={
                  <span>{`${
                    curFile?.data.last90.get(rest?.selectedPackage).counter
                  }`}</span>
                }
                src={
                  <FindPrevRes
                    prevCounter={prevResults?.last90.counter}
                    currentCount={
                      curFile?.data.last90.get(rest?.selectedPackage).counter
                    }
                  />
                }
              />
              <Card
                desc="Pushet < 180 dager"
                content={
                  <span>{`${
                    curFile?.data.last180.get(rest?.selectedPackage).counter
                  }`}</span>
                }
                src={
                  <FindPrevRes
                    prevCounter={prevResults?.last180.counter}
                    currentCount={
                      curFile?.data.last180.get(rest?.selectedPackage).counter
                    }
                  />
                }
              />
              <Card
                desc="Ikke oppdaterte repo"
                content={
                  <span>{`${
                    pack.counter -
                    curFile?.data.last180.get(rest?.selectedPackage).counter
                  }`}</span>
                }
                src={
                  <FindPrevRes
                    prevCounter={
                      prevResults?.packages.counter -
                      prevResults?.last180.counter
                    }
                    currentCount={
                      pack.counter -
                      curFile?.data.last180.get(rest?.selectedPackage).counter
                    }
                  />
                }
              />
            </div>
          </div>
          <VersionTable pack={JSON.stringify(pack, replacer)} />
        </div>
      ) : (
        <HistoryTable files={files} />
      )}
    </div>
  );
};

export default Dataview;
