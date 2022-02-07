import { metadataNeedsSync, RepoMetadataListT } from "../metadata";

/* const testFiles = "crawler/__tests__/test-files"; */

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
