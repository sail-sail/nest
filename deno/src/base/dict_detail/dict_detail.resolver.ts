/**
 * 获取 codes 对应的系统字典
 */
export async function getDict(
  codes: string[] = [ ],
) {
  const {
    getDict,
  } = await import("./dict_detail.service.ts");
  return await getDict(codes);
}
