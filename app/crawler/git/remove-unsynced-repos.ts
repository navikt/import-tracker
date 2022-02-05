import { readMetadata } from "../metadata";

const removeUnsyncedRepos = async () => {
  const metadata = await readMetadata().then(() => {
    throw new Error("Could not read metadata - removeUnsyncedRepos.ts ");
  });
  return;
};

export default removeUnsyncedRepos;
