import {getImportsFromFile} from "../getImports";

const res = `[{"source":"Package-1","imports":[{"name":"Package","default":true},{"name":"function1","default":false},{"name":"function2","default":false},{"name":"function3","default":false}]},{"source":"Package-3","imports":[]},{"source":"Package-4","imports":[{"name":"*","default":false}]},{"source":"Package-2","imports":[]}]`;

describe("getImports", () => {
  it("should get correct import-structure from JS-files", () => {
    expect(JSON.stringify(getImportsFromFile(__dirname + "/testFiles/file1.js"))).toEqual(
      res
    );
  });
  it("should get correct import-structure from JSX-files", () => {
    expect(
      JSON.stringify(getImportsFromFile(__dirname + "/testFiles/file2.jsx"))
    ).toEqual(res);
  });
  it("should get correct import-structure from TS-files", () => {
    expect(JSON.stringify(getImportsFromFile(__dirname + "/testFiles/file3.ts"))).toEqual(
      res
    );
  });
  it("should get correct import-structure from TSX-files", () => {
    expect(
      JSON.stringify(getImportsFromFile(__dirname + "/testFiles/file4.tsx"))
    ).toEqual(res);
  });
});
