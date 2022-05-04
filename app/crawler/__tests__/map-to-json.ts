import { replacer, reviver, stringify } from "../parsing/map-to-json";

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

test("reviver", async () => {
  const data = JSON.parse(
    `{"_type":"map","map":[["a","1"],["b","2"]]}`,
    reviver
  );
  const map = new Map().set("a", "1").set("b", "2");

  map.forEach((val, key) => expect(data.get(key)).toEqual(val));
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
