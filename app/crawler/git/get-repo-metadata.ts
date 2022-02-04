import { Octokit } from "@octokit/core";
import { paginateRest } from "@octokit/plugin-paginate-rest";
import { retry } from "@octokit/plugin-retry";
import fs from "fs";
import { RepoMetadataListT } from ".";

const octokit = Octokit.plugin(paginateRest, retry).defaults({
  userAgent: "Designsystem-dependency crawler",
  auth: process.env.TOKEN,
});

const MyOctokit = new octokit();

const languages = [
  "typescript",
  "javascript",
  "css",
  "markdown",
  "html",
  "tsx",
  "jsx",
  "json",
  "scss",
];

const fileLocation = "crawler/files/metadata-repos.json";

const read = () =>
  new Promise<RepoMetadataListT | null>((resolve, reject) => {
    fs.readFile(fileLocation, (e, data) => {
      if (e) {
        console.log("No metadata-repos file found, generating new file.");
        reject(null);
      } else {
        const parsed = JSON.parse(data.toString());
        if (
          (new Date().getMilliseconds() -
            new Date(parsed.last_update).getMilliseconds()) /
            1000 /
            60 /
            60 <
          24
        ) {
          console.log(
            "Assuming metadata-repos is fresh, skips fetching from git"
          );
          resolve(parsed);
        }
      }
    });
  });

const getRepoMetadata = async (): Promise<RepoMetadataListT> => {
  /* Read local file if exists, skip fetching new data if last run within 24h */

  const readData = await read();
  if (readData) return readData;

  /* Fetches all repos in NAVIKT and cherrypicks wanted metadata */
  let repos = await MyOctokit.paginate("GET /orgs/navikt/repos", {
    per_page: 100,
  }).then((r) =>
    r.map(({ name, language, pushed_at, archived }) => ({
      name,
      language,
      pushed_at,
      archived,
    }))
  );

  /* Lets skip archived and assumed irrelevant languages */
  repos = repos
    .filter((r) => !r.archived)
    .filter((r) => languages.includes(r.language?.toLowerCase?.()));

  const data: RepoMetadataListT = { last_update: new Date(), repos };

  fs.writeFileSync(fileLocation, JSON.stringify(data, null, 2));

  return data;
};

export default getRepoMetadata;
