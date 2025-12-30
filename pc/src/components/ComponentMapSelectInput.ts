
const componentMapSelectInput: Record<string, () => Promise<Component>> = {
  "DynPageSelectInput": () => import("@/views/base/dyn_page/SelectInput.vue"),
  "RoleSelectInput": () => import("@/views/base/role/SelectInput.vue"),
  "UsrSelectInput": () => import("@/views/base/usr/SelectInput.vue"),
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
];

export async function getComponentKeysSelectInput() {
  return componentKeysSelectInput;
}

export default componentMapSelectInput;
