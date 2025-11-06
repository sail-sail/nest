import 
  componentMapSelectInput,
  {
    getComponentKeysSelectInput,
  }
from "@/components/ComponentMapSelectInput.ts";

const componentMap: Record<string, () => Promise<Component>> = {
  // Custom 系列组件
  "CustomCheckbox": () => import("@/components/CustomCheckbox.vue"),
  "CustomCityPicker": () => import("@/components/CustomCityPicker.vue"),
  "CustomColorPicker": () => import("@/components/CustomColorPicker.vue"),
  "CustomDatePicker": () => import("@/components/CustomDatePicker.vue"),
  "CustomDialog": () => import("@/components/CustomDialog.vue"),
  "CustomIcon": () => import("@/components/CustomIcon.vue"),
  "CustomIconSelect": () => import("@/components/CustomIconSelect.vue"),
  "CustomInput": () => import("@/components/CustomInput.vue"),
  "CustomInputNumber": () => import("@/components/CustomInputNumber.vue"),
  "CustomSelect": () => import("@/components/CustomSelect.vue"),
  "CustomSwitch": () => import("@/components/CustomSwitch.vue"),
  "CustomTreeSelect": () => import("@/components/CustomTreeSelect.vue"),
  // Dict 系列组件
  "DictbizSelect": () => import("@/components/DictbizSelect.vue"),
  "DictSelect": () => import("@/components/DictSelect.vue"),
  ...componentMapSelectInput,
};

const componentKeys = [
  {
    value: "CustomInput",
    label: "文本框",
  },
  {
    value: "CustomInputNumber",
    label: "数字输入框",
  },
  {
    value: "CustomDatePicker",
    label: "日期选择器",
  },
  {
    value: "CustomSelect",
    label: "下拉选择框",
  },
  {
    value: "CustomCheckbox",
    label: "勾选框",
  },
  {
    value: "CustomSwitch",
    label: "开关",
  },
  {
    value: "CustomColorPicker",
    label: "颜色选择器",
  },
  {
    value: "CustomTreeSelect",
    label: "树下拉框",
  },
  {
    value: "DictSelect",
    label: "系统字典下拉框",
  },
  {
    value: "DictbizSelect",
    label: "业务字典下拉框",
  },
  {
    value: "CustomCityPicker",
    label: "城市选择器",
  },
  {
    value: "CustomIconSelect",
    label: "图标选择器",
  },
];

export async function getComponentKeys() {
  return componentKeys.concat(await getComponentKeysSelectInput());
}

export default componentMap;
