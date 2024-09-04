export const addToSum = (acc: number, value: number) => (acc += value);

export const totalsByKeys = <T extends object, K extends keyof T>(
  records: T[],
  keys: ReadonlyArray<K>
) => {
  const init = {} as Record<K, number>;
  for (const key in keys) {
    init[keys[key]] = 0;
  }

  return records.reduce((acc, record: T) => {
    for (const key of keys) {
      acc[key] = acc[key] + ((record[key] as number) ?? 0);
    }
    return acc;
  }, init);
};
