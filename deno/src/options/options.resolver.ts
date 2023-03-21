
export async function getOptionsByLbl(
  lbl: string,
) {
  const {
    getOptionsByLbl,
  } = await import("./options.service.ts");
  return await getOptionsByLbl(lbl);
}
