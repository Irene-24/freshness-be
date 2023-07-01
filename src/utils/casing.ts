import { omit, snakeToCamel as camelCase } from "@/utils/miscHelpers";

export const toCamelCase = <T>(row: Record<string, any>): T => {
  for (const key in row) {
    row[camelCase(key)] = row[key];
    if (key.includes("_")) {
      row = omit(row, key);
    }
  }

  return row as T;
};

export const toCamelCaseRows = <T>(rows: Record<string, any>[]): T[] => {
  return rows.map((row) => toCamelCase(row));
};
