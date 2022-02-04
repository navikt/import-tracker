import getRepoMetadata from "./get-repo-metadata";

export type RepoMetadataT = {
  name: string;
  language: string;
  pushed_at: Date;
  archived: boolean;
};

export type RepoMetadataListT = {
  last_update: Date;
  repos: RepoMetadataT[];
};

const Git = async () => {
  const repoMetadata = await getRepoMetadata();
  return null;
};

export default Git;
