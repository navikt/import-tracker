import fs from "fs";
import mock from "mock-fs";
import removeUnsynced, { deleteRepos } from "../../git/remove-unsynced";

const metaFile = JSON.stringify({
  repo_sync: "2100-02-05T14:53:55.968Z",
  repos: [
    {
      name: "nav-frontend",
      language: "CSS",
      pushed_at: "2021-10-23T07:18:48Z",
      archived: false,
    },
    {
      name: "aksel",
      language: "CSS",
      pushed_at: "2222-01-27T15:34:02Z",
      archived: false,
    },
  ],
  last_crawl: "2050-02-07T20:20:35.825Z",
});

describe("Deleting unsynced repos", () => {
  beforeEach(() => {
    mock({
      "crawler/files": {
        "metadata.json": metaFile,
        repositories: {
          "nav-frontend": { "index.js": "console.log('Hello')" },
          aksel: { "index.js": "console.log('World')" },
        },
      },
    });
  });

  afterEach(() => {
    mock.restore();
  });

  test("deleteRepos", async () => {
    expect(fs.existsSync("crawler/files/repositories/nav-frontend")).toBe(true);
    deleteRepos([
      {
        name: "nav-frontend",
        language: "CSS",
        pushed_at: new Date(),
        archived: false,
      },
    ]);
    expect(fs.existsSync("crawler/files/repositories/nav-frontend")).toBe(
      false
    );
  });

  /* aksel is unsynced */
  test("deleteRepos", async () => {
    expect(fs.existsSync("crawler/files/repositories/aksel")).toBe(true);
    expect(fs.existsSync("crawler/files/repositories/nav-frontend")).toBe(true);
    await removeUnsynced();
    expect(fs.existsSync("crawler/files/repositories/aksel")).toBe(false);
    expect(fs.existsSync("crawler/files/repositories/nav-frontend")).toBe(true);
  });
});
