import fs from "fs";

export type RepoMetadataT = {
  name: string;
  language: string;
  pushed_at: Date;
  archived: boolean;
};

export type RepoMetadataListT = {
  repo_sync?: Date;
  last_crawl?: Date;
  repos?: RepoMetadataT[];
};

const fileLocation = "crawler/files/metadata.json";

/**
 * Reads metada if avaliable
 */
export const readMetadata = () =>
  new Promise<RepoMetadataListT | null>((resolve, reject) =>
    fs.readFile(fileLocation, (e, data) =>
      e ? reject(null) : resolve(JSON.parse(data.toString()))
    )
  );

/**
 * Writes metadata to JSON file.
 */
export const writeMetadata = (data: Partial<RepoMetadataListT>) =>
  new Promise<number>(async (resolve, reject) => {
    readMetadata()
      .then((metadata) =>
        fs.writeFile(
          fileLocation,
          JSON.stringify({ ...(metadata ?? {}), ...data }),
          null,
          (e) => (e ? reject(0) : resolve(1))
        )
      )
      .catch(() =>
        fs.writeFile(fileLocation, JSON.stringify({ ...data }), null, (e) =>
          e ? reject(0) : resolve(1)
        )
      );
  });

/* Assume that data a refresh if 24 old */
export const metadataNeedsSync = (data: RepoMetadataListT | null) => {
  if (!data || !data.repo_sync) return true;
  return (
    new Date().getTime() -
      new Date(data.repo_sync).getTime() / 1000 / 3600 / 24 <
    24
  );
};

export const updateLastCrawl = () =>
  writeMetadata({ last_crawl: new Date() }).catch(() =>
    console.error("Failed syncing last crawel in Metadata")
  );
