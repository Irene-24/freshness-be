const omit = <T extends Record<string, any>, K extends keyof T>(
  object: T,
  omittedKeys: K | K[]
) => {
  const keysArray = Array.isArray(omittedKeys) ? omittedKeys : [omittedKeys];

  const newObj = {} as Omit<T, K>;

  let key: keyof T;

  for (key in object) {
    if (
      Object.prototype.hasOwnProperty.call(object, key) &&
      !keysArray.includes(key as K)
    ) {
      newObj[key as Exclude<keyof T, K>] = object[key as Exclude<keyof T, K>];
    }
  }

  return newObj;
};

const pick = <T extends Record<string, any>, K extends keyof T>(
  object: T,
  allowedKeys: K | K[]
) => {
  const keysArray = Array.isArray(allowedKeys) ? allowedKeys : [allowedKeys];

  const result = {} as Pick<T, K>;

  keysArray.forEach((key) => {
    result[key] = object[key];
  }, result);

  return result;
};

const snakeToCamel = (str: string) => {
  if (!str.trim()) {
    throw new Error("Empty string cannot be converted to camel Case");
  }

  return str
    .toLowerCase()
    .replace(/([-_][a-z0-9])/g, (group: string) =>
      group.toUpperCase().replace("-", "").replace("_", "")
    );
};

const camelToSnake = (str: string) => {
  if (!str.trim()) {
    throw new Error("Empty string cannot be converted to snake Case");
  }

  return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
};

function appendQueryParam(
  url: string,
  paramName: string,
  paramValue: string
): string {
  const urlObject = new URL(url);
  urlObject.searchParams.append(paramName, paramValue);
  return urlObject.toString();
}

export { omit, snakeToCamel, pick, appendQueryParam, camelToSnake };
