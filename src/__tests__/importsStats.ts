import {manipulateImportData} from "../importsStats";

const input = [
  {
    source: "Package-1",
    imports: [
      {name: "Package", default: true},
      {name: "function1", default: false},
      {name: "function2", default: false},
      {name: "function3", default: false},
    ],
  },
  {source: "Package-3", imports: []},
  {source: "Package-4", imports: [{name: "*", default: false}]},
  {source: "Package-2", imports: []},
];

const res = JSON.stringify({
  "Package-1": {
    uses: 2,
    defaultUses: 2,
    namedUses: {
      function1: 2,
      function2: 2,
      function3: 2,
    },
  },
  "Package-3": {
    uses: 2,
    defaultUses: 0,
    namedUses: {},
  },
  "Package-4": {
    uses: 2,
    defaultUses: 0,
    namedUses: {
      "*": 2,
    },
  },
  "Package-2": {
    uses: 2,
    defaultUses: 0,
    namedUses: {},
  },
});

describe("getImports", () => {
  it("should create correct result based on input", () => {
    expect(JSON.stringify(manipulateImportData([input, input]))).toEqual(res);
  });
});
