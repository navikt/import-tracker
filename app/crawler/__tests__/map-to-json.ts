import { replacer, stringify } from "../parsing/map-to-json";

test("replacer", async () => {
  const testMap = new Map();

  testMap.set("a", new Map().set("y", "myvalue"));
  testMap.set("b", new Map().set("z", "myvalue2"));

  expect(JSON.stringify(testMap, replacer).replace(/\\/g, "")).toEqual(
    JSON.stringify({
      _type: "map",
      map: [
        ["a", { _type: "map", map: [["y", "myvalue"]] }],
        ["b", { _type: "map", map: [["z", "myvalue2"]] }],
      ],
    })
  );
});

test("stringify", async () => {
  const testMap = new Map();

  testMap.set("a", new Map().set("y", "myvalue"));
  testMap.set("b", new Map().set("z", "myvalue2"));

  expect(stringify(testMap)).toEqual(
    JSON.stringify({
      _type: "map",
      map: [
        ["a", { _type: "map", map: [["y", "myvalue"]] }],
        ["b", { _type: "map", map: [["z", "myvalue2"]] }],
      ],
    })
  );
});
