import {
  metadataNeedsSync,
  readMetadata,
  updateLastCrawl,
  writeMetadata,
} from "../metadata";
import mock from "mock-fs";
import { readFileSync } from "fs";
/* import { main } from "./modifyFile"; */

const metaFile = JSON.stringify({
  repo_sync: "2100-02-05T14:53:55.968Z",
  repos: [
    {
      name: "nav-labs",
      language: "CSS",
      pushed_at: "2021-10-23T07:18:48Z",
      archived: false,
    },
    {
      name: "vera",
      language: "CSS",
      pushed_at: "2022-01-27T15:34:02Z",
      archived: false,
    },
  ],
  last_crawl: "2050-02-07T20:20:35.825Z",
});

const newFile = {
  repo_sync: new Date(),
  repos: [
    {
      name: "Aksel",
      language: "CSS",
      pushed_at: new Date(),
      archived: false,
    },
    {
      name: "nav-frontend",
      language: "CSS",
      pushed_at: new Date(),
      archived: false,
    },
  ],
  last_crawl: new Date(),
};

describe("metadata Filehandling", () => {
  beforeEach(() => {
    const dir = `crawler/files`;
    mock({
      [dir]: {
        "metadata.json": metaFile,
      },
    });
  });

  afterEach(() => {
    mock.restore();
  });

  test("readMetadata", async () => {
    const data = await readMetadata();
    expect(JSON.stringify(data)).toBe(metaFile);
  });

  test("writeMetadata", async () => {
    await writeMetadata(newFile);
    const result = readFileSync("crawler/files/metadata.json");

    expect(JSON.stringify(JSON.parse(result.toString()))).toBe(
      JSON.stringify(newFile)
    );
  });

  test("updateLastCrawl", async () => {
    await updateLastCrawl();
    const result = readFileSync("crawler/files/metadata.json");

    expect(JSON.parse(result.toString()).last_crawl).not.toBe(
      "2050-02-07T20:20:35.825Z"
    );
  });
});

/* Over 24h ago */
test("metadataNeedsSync -> true", () => {
  const date = new Date();
  date.setDate(date.getDate() - 2);

  expect(
    metadataNeedsSync({
      repo_sync: date,
    })
  ).toEqual(true);
});

/* under 24h ago */
test("metadataNeedsSync -> false", () => {
  const date = new Date();
  date.setDate(date.getDate() - 0.5);
  expect(
    metadataNeedsSync({
      repo_sync: new Date(),
    })
  ).toEqual(false);
});
