/**
 * 获取 codes 对应的业务字典
 */
export async function getDictbiz(
  codes: string[] = [ ],
) {
  const {
    getDictbiz,
  } = await import("./dictbiz_detail.service.ts");
  
  return await getDictbiz(codes);
}
