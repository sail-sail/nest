import type {
  Query,
} from "/gen/types.ts";

/**
 * 获取语言列表
 */
export async function getLoginLangs(): Promise<Query["getLoginLangs"]> {
  const {
    findAll: findAllLang,
  } = await import("/gen/base/lang/lang.dao.ts");
  
  const langs = await findAllLang({
    is_enabled: [ 1 ],
  });
  
  return langs;
}
