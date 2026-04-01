
const componentMapSelectInput: Record<string, () => Promise<Component>> = {
  "DynPageSelectInput": () => import("@/views/base/dyn_page/SelectInput.vue"),
  "RoleSelectInput": () => import("@/views/base/role/SelectInput.vue"),
  "UsrSelectInput": () => import("@/views/base/usr/SelectInput.vue"),
  "ProcessDefSelectInput": () => import("@/views/bpm/process_def/SelectInput.vue"),
  "ProcessRevisionSelectInput": () => import("@/views/bpm/process_revision/SelectInput.vue"),
};

const componentKeysSelectInput = [
  {
    value: "DynPageSelectInput",
    label: "动态页面选择框",
  },
  {
    value: "RoleSelectInput",
    label: "角色选择框",
  },
  {
    value: "UsrSelectInput",
    label: "用户选择框",
  },
  {
    value: "ProcessDefSelectInput",
    label: "流程定义选择框",
  },
  {
    value: "ProcessRevisionSelectInput",
    label: "流程版本选择框",
  },
];

export async function getComponentKeysSelectInput() {
  return componentKeysSelectInput;
}

export default componentMapSelectInput;
