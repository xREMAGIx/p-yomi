import { Keys } from "./types";

export function mapModifiers(
  baseClassName: string,
  ...modifiers: (string | string[] | false | undefined)[]
): string {
  return modifiers
    .reduce<string[]>(
      (acc, m) => (!m ? acc : [...acc, ...(typeof m === "string" ? [m] : m)]),
      []
    )
    .map((m) => `-${m}`)
    .reduce<string>(
      (classNames, suffix) => `${classNames} ${baseClassName}${suffix}`,
      baseClassName
    );
}

export function commafy(num: number) {
  const str = num.toString().split(".");
  if (str[0].length >= 5) {
    str[0] = str[0].replace(/(\d)(?=(\d{3})+$)/g, "$1,");
  }
  if (str[1] && str[1].length >= 5) {
    str[1] = str[1].replace(/(\d{3})/g, "$1");
  }
  return str.join(".");
}

type Descripted<T> = {
  [K in keyof T]: {
    readonly id: T[K];
    readonly description: string;
  };
}[keyof T];

/**
 * Helper to produce an array of enum descriptors.
 * @param enumeration Enumeration object.
 * @param separatorRegex Regex that would catch the separator in your enum key.
 */
export function enumToDescriptedArray<T extends object>(
  enumeration: T,
  separatorRegex: RegExp = /_/g
): Descripted<T>[] {
  return (Object.keys(enumeration) as Array<keyof T>)
    .filter((key) => isNaN(Number(key)))
    .filter(
      (key) =>
        typeof enumeration[key] === "number" ||
        typeof enumeration[key] === "string"
    )
    .map((key) => ({
      id: enumeration[key],
      description: String(key).replace(separatorRegex, " "),
    }));
}

/**
 * Helper to produce an array of enum values.
 * @param enumeration Enumeration object.
 */
export function enumValuesToArray<T extends object>(enumeration: T) {
  return Object.keys(enumeration)
    .filter((key) => isNaN(Number(key)))
    .map((key) => enumeration[key as keyof typeof enumeration])
    .filter((val) => typeof val === "number" || typeof val === "string");
}

export const keys = <T extends object>(o: T): Keys<T> =>
  Object.keys(o) as unknown as [keyof T][];
