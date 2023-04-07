import * as optionsDao from "/gen/base/options/options.dao.ts";

/**
 * 获取系统选项
 * @param lbl 
 */
export async function getOptionsByLbl(
  lbl: string,
) {
  const optionsModels = await optionsDao.findAll({
    lbl,
  });
  return optionsModels;
}

/**
 * 更新国际化版本号
 **/
export async function updateI18n_version() {
  const models = await getOptionsByLbl("国际化版本号");
  const optionsModel = models.find((m) => m.ky === "i18n_version");
  if (!optionsModel) {
    const i18n_version = "1";
    await optionsDao.create({
      lbl: "国际化版本号",
      ky: "i18n_version",
      val: i18n_version,
      order_by: 1,
      is_enabled: 1,
      is_locked: 1,
    });
    return i18n_version;
  }
  const i18n_version = ((Number(optionsModel.val) || 0) + 1).toString();
  await optionsDao.updateById(
    optionsModel.id,
    {
      val: i18n_version,
    },
  );
  return i18n_version;
}
