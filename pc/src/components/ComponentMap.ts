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

// 组件属性配置类型定义
export interface ComponentPropConfig {
  prop: string;        // 属性名
  label: string;       // 显示标签
  type: "string" | "number" | "boolean" | "select";  // 类型
  options?: Array<{ label: string; value: string }>;  // 当 type="select" 时的预定义选项 { label: 中文, value: 英文编码 }
  isOptionsConfig?: boolean;  // 标记此字段用于配置下拉选项(使用 el-input-tag)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  default?: any;       // 默认值
}

// 组件属性配置映射
export const componentPropsConfig: Record<string, ComponentPropConfig[]> = {
  "CustomInput": [
    { prop: "placeholder", label: "占位符", type: "string" },
    { prop: "maxlength", label: "最大长度", type: "number" },
    { prop: "type", label: "输入类型", type: "select", default: "text", options: [
      { label: "文本", value: "text" },
      { label: "密码", value: "password" },
      { label: "多行文本", value: "textarea" },
    ] },
    { prop: "minRows", label: "最小行数", type: "number" },
    { prop: "maxRows", label: "最大行数", type: "number" },
    { prop: "clearable", label: "可清空", type: "boolean" },
    { prop: "showWordLimit", label: "显示字数统计", type: "boolean" },
  ],
  "CustomInputNumber": [
    { prop: "placeholder", label: "占位符", type: "string" },
    { prop: "min", label: "最小值", type: "number" },
    { prop: "max", label: "最大值", type: "number" },
    { prop: "step", label: "步长", type: "number" },
    { prop: "precision", label: "精度", type: "number" },
    { prop: "controls", label: "显示控制按钮", type: "boolean" },
  ],
  "CustomDatePicker": [
    { prop: "placeholder", label: "占位符", type: "string" },
    { prop: "type", label: "日期类型", type: "select", default: "date", options: [
      { label: "日期", value: "date" },
      { label: "日期时间", value: "datetime" },
      { label: "日期范围", value: "daterange" },
      { label: "日期时间范围", value: "datetimerange" },
      { label: "月份", value: "month" },
      { label: "年份", value: "year" },
    ] },
    { prop: "format", label: "显示格式", type: "string" },
    { prop: "valueFormat", label: "值格式", type: "string" },
    { prop: "clearable", label: "可清空", type: "boolean" },
  ],
  "CustomSelect": [
    { prop: "placeholder", label: "占位符", type: "string" },
    { prop: "multiple", label: "多选", type: "boolean" },
    { prop: "clearable", label: "可清空", type: "boolean" },
    { prop: "options", label: "选项列表", type: "select", isOptionsConfig: true },
  ],
  "CustomCheckbox": [
    { prop: "trueReadonlyLabel", label: "真值只读标签", type: "string" },
    { prop: "falseReadonlyLabel", label: "假值只读标签", type: "string" },
  ],
  "CustomSwitch": [
    { prop: "activeText", label: "打开时文字", type: "string" },
    { prop: "inactiveText", label: "关闭时文字", type: "string" },
  ],
  "CustomColorPicker": [
    { prop: "showAlpha", label: "显示透明度", type: "boolean" },
    { prop: "colorFormat", label: "颜色格式", type: "select", default: "hex", options: [
      { label: "十六进制", value: "hex" },
      { label: "RGB", value: "rgb" },
      { label: "HSL", value: "hsl" },
      { label: "HSV", value: "hsv" },
    ] },
  ],
  "CustomTreeSelect": [
    { prop: "placeholder", label: "占位符", type: "string" },
    { prop: "multiple", label: "多选", type: "boolean" },
    { prop: "clearable", label: "可清空", type: "boolean" },
    { prop: "checkStrictly", label: "严格选择", type: "boolean" },
  ],
  "DictSelect": [
    { prop: "placeholder", label: "占位符", type: "string" },
    { prop: "code", label: "字典编码", type: "string" },
    { prop: "multiple", label: "多选", type: "boolean" },
  ],
  "DictbizSelect": [
    { prop: "placeholder", label: "占位符", type: "string" },
    { prop: "code", label: "字典编码", type: "string" },
    { prop: "multiple", label: "多选", type: "boolean" },
  ],
  "CustomCityPicker": [
    { prop: "placeholder", label: "占位符", type: "string" },
    { prop: "level", label: "级联层级", type: "select", options: [
      { label: "省份", value: "province" },
      { label: "城市", value: "city" },
      { label: "区县", value: "district" },
    ] },
  ],
  "CustomIconSelect": [
    { prop: "placeholder", label: "占位符", type: "string" },
    { prop: "clearable", label: "可清空", type: "boolean" },
  ],
  // 通用 SelectInput 配置 (适用于所有 *SelectInput 组件)
  "_SelectInput": [
    { prop: "placeholder", label: "占位符", type: "string" },
    { prop: "multiple", label: "多选", type: "boolean" },
    { prop: "labelReadonly", label: "标签只读", type: "boolean" },
    { prop: "selectListReadonly", label: "列表只读", type: "boolean" },
  ],
};

export default componentMap;
