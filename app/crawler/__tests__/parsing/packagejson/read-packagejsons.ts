import {
  filterPackageJsons,
  readPackageJsonFile,
  readPackageJsons,
} from "../../../parsing/packagejson/read-packagejsons";

const testFiles = "crawler/__tests__/test-files";
const json = {
  name: "test-repo",
  dependencies: {
    "@navikt/ds-css": "^0.14.0",
    "@navikt/ds-react": "^0.15.0",
  },
  devDependencies: {
    react: "^17.0.1",
  },
  peerDependencies: {
    "react-dom": "^17.0.1",
  },
};

const jsonFiltered = {
  dependencies: {
    "@navikt/ds-css": "^0.14.0",
    "@navikt/ds-react": "^0.15.0",
  },
  devDependencies: {
    react: "^17.0.1",
  },
  peerDependencies: {
    "react-dom": "^17.0.1",
  },
};

test("read package.json file", async () => {
  const prefix = `${testFiles}/test-repo`;

  const data = await readPackageJsonFile(`${prefix}/package.json`);

  expect(JSON.stringify(data)).toEqual(JSON.stringify(json));
});

test("readPackageJsons", async () => {
  const prefix = `${testFiles}/test-repo`;

  const data = await readPackageJsons([
    {
      name: "test-repo",
      source: prefix,
      files: [`${prefix}/package.json`],
    },
    {
      name: "test-repo2",
      source: prefix + "2",
      files: [`${prefix}/package.json`, `${prefix}/package.json`],
    },
  ]);

  expect(JSON.stringify(data)).toEqual(
    JSON.stringify([
      {
        name: "test-repo",
        source: prefix,
        files: [jsonFiltered],
      },
      {
        name: "test-repo2",
        source: prefix + "2",
        files: [jsonFiltered, jsonFiltered],
      },
    ])
  );
});

test("filterPackageJsons", async () => {
  const data = await filterPackageJsons([
    {
      name: "test-repo",
      source: "demo",
      files: [json],
    },
    {
      name: "test-repo2",
      source: "demo",
      files: [json, json],
    },
  ]);

  expect(JSON.stringify(data)).toEqual(
    JSON.stringify([
      {
        name: "test-repo",
        source: "demo",
        files: [jsonFiltered],
      },
      {
        name: "test-repo2",
        source: "demo",
        files: [jsonFiltered, jsonFiltered],
      },
    ])
  );
});
