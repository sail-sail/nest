
/**
 * 获取语言列表
 */
export async function getLoginLangs() {
  const {
    getLoginLangs,
  } = await import("./lang.service.ts");
  
  return await getLoginLangs();
}
