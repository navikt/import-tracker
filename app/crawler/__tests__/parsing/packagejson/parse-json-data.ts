import { replacer } from "../../../parsing/map-to-json";
import { updatePackageMap } from "../../../parsing/packagejson/parse-json-data";

test("updatePackageMap", () => {
  let startMap = new Map();

  startMap = updatePackageMap(
    "@navikt/ds-react",
    "1",
    "nav-frontend-moduler",
    startMap
  );
  startMap = updatePackageMap(
    "@navikt/ds-react",
    "2",
    "nav-frontend-moduler",
    startMap
  );
  startMap = updatePackageMap(
    "@navikt/ds-react",
    "^1",
    "aksel-website",
    startMap
  );
  startMap = updatePackageMap(
    "@navikt/ds-css",
    "^1",
    "aksel-website",
    startMap
  );

  expect(JSON.stringify(startMap, replacer).replace(/\\/g, "")).toEqual(
    JSON.stringify({
      _type: "map",
      map: [
        [
          "@navikt/ds-react",
          {
            counter: 3,
            versions: {
              _type: "map",
              map: [
                ["1", ["nav-frontend-moduler"]],
                ["2", ["nav-frontend-moduler"]],
                ["^1", ["aksel-website"]],
              ],
            },
          },
        ],
        [
          "@navikt/ds-css",
          {
            counter: 1,
            versions: {
              _type: "map",
              map: [["^1", ["aksel-website"]]],
            },
          },
        ],
      ],
    })
  );
});
