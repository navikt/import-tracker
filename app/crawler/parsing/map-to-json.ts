export function replacer(key, value) {
  if (value instanceof Map) {
    return {
      _type: "map",
      map: [...value],
    };
  } else return value;
}

export const stringify = (data: any) =>
  JSON.stringify(data, replacer).replace(/\\/g, "");

/* function reviver(key, value) {
    if (value._type == "map") return new Map(value.map);
    else return value;
  } */
