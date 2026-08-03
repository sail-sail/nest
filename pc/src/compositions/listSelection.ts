export function getSelectionDiff<T extends string | number>(
  nextIds: T[],
  prevIds: T[],
) {
  const prevSet = new Set(prevIds);
  const nextSet = new Set(nextIds);

  const add = nextIds.filter((id) => !prevSet.has(id));
  const remove = prevIds.filter((id) => !nextSet.has(id));

  return { add, remove };
}
