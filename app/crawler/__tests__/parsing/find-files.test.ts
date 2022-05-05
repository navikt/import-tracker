import { getDirectories, getGroupedFiles } from "../../parsing/find-files";

const testFiles = "crawler/__tests__/test-files";

test("getDirectories", async () => {
  const dirs = await getDirectories(testFiles);
  expect(dirs.length).toBe(1);
});

test("getGroupedFiles js", async () => {
  const prefix = `${testFiles}/test-repo`;

  const files = await getGroupedFiles(`**/*.+(tsx|jsx|js|ts|mjs)`, testFiles);
  expect(JSON.stringify(files)).toEqual(
    JSON.stringify([
      {
        name: "test-repo",
        source: prefix,
        last_update: null,
        files: [`${prefix}/files/Component.tsx`],
      },
    ])
  );
});

test("getGroupedFiles package.json", async () => {
  const prefix = `${testFiles}/test-repo`;

  const files = await getGroupedFiles(`**/package.json`, testFiles);
  expect(JSON.stringify(files)).toEqual(
    JSON.stringify([
      {
        name: "test-repo",
        source: prefix,
        last_update: null,
        files: [`${prefix}/package.json`],
      },
    ])
  );
});
