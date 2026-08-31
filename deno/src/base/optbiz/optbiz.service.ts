import { findOneOptbiz } from "/gen/base/optbiz/optbiz.dao.ts";

/**
 * 移动端是否发版中 uni_releasing
 */
export async function getUniReleasing(): Promise<boolean> {
  const optbizModel = await findOneOptbiz({
    ky: "uni_releasing",
  });

  if (!optbizModel) {
    return false;
  }

  if (optbizModel.is_enabled === 0) {
    return false;
  }

  return optbizModel.val === "1";
}
