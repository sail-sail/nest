import {
  useI18n,
} from "@/locales/i18n";

export async function initDetailI18ns() {
  const {
    initSysI18ns,
  } = useI18n("");
  const codes = [
    "请输入",
    "请选择",
    "增加成功",
    "修改成功",
    "取消",
    "保存",
    "上一项",
    "下一项",
    "开始",
  ];
  await initSysI18ns(codes);
}
