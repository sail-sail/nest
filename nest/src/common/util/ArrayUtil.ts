
export function chunkArray<T>(array :T[], subGroupLength: number): T[][] {
  if (array.length <= subGroupLength) {
    return [ array ];
  }
  let index = 0;
  let newArray :T[][] = [];
  while (index < array.length) {
    newArray.push(array.slice(index, index += subGroupLength));
  }
  return newArray;
}
