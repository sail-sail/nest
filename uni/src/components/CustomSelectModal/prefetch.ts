export type PrefetchOptionItem<T = unknown> = {
  value?: T;
};

export type PrefetchOptionsMap<T = unknown> = (item: T) => PrefetchOptionItem<T>;

export function shouldPrefetchSelectedOptions<T>({
  isPage,
  showPicker,
  isLoading,
  modelValues,
  dataItems,
  optionsMap,
}: {
  isPage: boolean;
  showPicker: boolean;
  isLoading: boolean;
  modelValues: unknown[];
  dataItems: T[];
  optionsMap: PrefetchOptionsMap<T>;
}) {
  if (!isPage || showPicker || isLoading) {
    return false;
  }
  if (modelValues.length === 0) {
    return false;
  }

  const missingValues = modelValues.filter((value) => {
    return !dataItems.some((item) => optionsMap(item).value === value);
  });

  return missingValues.length > 0;
}
