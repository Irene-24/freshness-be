import { snakeToCamel as camelCase } from "@/utils/miscHelpers";

export const toCamelCase = <T>(row: Record<string, any>): T => {
  const camelCaseRow: Record<string, any> = {};

  for (const key in row) {
    const camelCaseKey = camelCase(key);
    camelCaseRow[camelCaseKey] = row[key];
    if (key.includes("_")) {
      delete camelCaseRow[key];
    }
  }

  return camelCaseRow as T;
};

export const toCamelCaseRows = <T>(rows: Record<string, any>[]): T[] => {
  return rows.map((row) => toCamelCase(row));
};
