import CustomInput from "@/components/CustomInput/CustomInput.vue";
import CustomSelectModal from "@/components/CustomSelectModal/CustomSelectModal.vue";
import CustomDate from "@/components/CustomDate/CustomDate.vue";
import DictSelect from "@/components/DictSelect/DictSelect.vue";
import DictbizSelect from "@/components/DictbizSelect/DictbizSelect.vue";

// 组件映射表（静态导入）
const componentMap: Record<string, Component> = {
  // Custom 系列组件
  "CustomInput": CustomInput,
  "CustomInputNumber": CustomInput, // 映射到 CustomInput，使用时自动加 type="number"
  "CustomSelectModal": CustomSelectModal,
  "CustomDate": CustomDate,
  // Dict 系列组件
  "DictSelect": DictSelect,
  "DictbizSelect": DictbizSelect,
};

// PC 端组件名 -> 移动端组件名 映射
export const nameMapping: Record<string, string> = {
  "CustomSelect": "CustomSelectModal",
  "CustomDatePicker": "CustomDate",
};

// 需要自动添加属性的组件
export const autoProps: Record<string, Record<string, unknown>> = {
  "CustomInputNumber": { type: "number" },
};

// 组件列表（用于下拉选择）
export const componentKeys = [
  {
    value: "CustomInput",
    label: "文本框",
  },
  {
    value: "CustomInputNumber",
    label: "数字输入框",
  },
  {
    value: "CustomDate",
    label: "日期选择器",
  },
  {
    value: "CustomSelectModal",
    label: "下拉选择框",
  },
  {
    value: "DictSelect",
    label: "系统字典下拉框",
  },
  {
    value: "DictbizSelect",
    label: "业务字典下拉框",
  },
];

// 组件属性配置类型定义
export interface ComponentPropConfig {
  prop: string;        // 属性名
  label: string;       // 显示标签
  type: "string" | "number" | "boolean" | "select";  // 类型
  options?: Array<{ label: string; value: string }>;  // 当 type="select" 时的预定义选项
  isOptionsConfig?: boolean;  // 标记此字段用于配置下拉选项
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  default?: any;       // 默认值
}

// 组件属性配置映射（以 PC 端为准，仅保留移动端支持的属性）
export const componentPropsConfig: Record<string, ComponentPropConfig[]> = {
  "CustomInput": [
    { prop: "placeholder", label: "占位符", type: "string" },
    { prop: "type", label: "输入类型", type: "select", default: "text", options: [
      { label: "文本", value: "text" },
      { label: "数字", value: "number" },
      { label: "小数", value: "decimal" },
      { label: "多行文本", value: "textarea" },
      { label: "身份证", value: "idcard" },
      { label: "电话", value: "tel" },
    ] },
    { prop: "clearable", label: "可清空", type: "boolean" },
    { prop: "precision", label: "精度", type: "number" },
  ],
  "CustomInputNumber": [
    { prop: "placeholder", label: "占位符", type: "string" },
    { prop: "precision", label: "精度", type: "number" },
    { prop: "clearable", label: "可清空", type: "boolean" },
  ],
  "CustomDate": [
    { prop: "placeholder", label: "占位符", type: "string" },
    { prop: "clearable", label: "可清空", type: "boolean" },
  ],
  "CustomSelectModal": [
    { prop: "placeholder", label: "占位符", type: "string" },
    { prop: "multiple", label: "多选", type: "boolean" },
    { prop: "clearable", label: "可清空", type: "boolean" },
    { prop: "options", label: "选项列表", type: "select", isOptionsConfig: true },
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
};

export default componentMap;
