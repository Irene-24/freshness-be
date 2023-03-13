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

export { omit };
