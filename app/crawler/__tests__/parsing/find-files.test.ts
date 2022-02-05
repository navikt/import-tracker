import { getDirectories, getGroupedFiles } from "../../parsing/find-files";

const testFiles = "crawler/__tests__/test-files";

test("getDirectories", async () => {
  const dirs = await getDirectories(testFiles);
  expect(dirs.length).toBe(1);
});

test("getGroupedFiles", async () => {
  const prefix = `${testFiles}/test-repo`;

  const files = await getGroupedFiles(testFiles);
  expect(JSON.stringify(files)).toEqual(
    JSON.stringify([
      {
        name: "test-repo",
        source: prefix,
        files: [`${prefix}/files/Component.tsx`],
      },
    ])
  );
});
