<template>
<ElSelectV2
  :placeholder="props.placeholder"
  :options="options4SelectV2"
  filterable
  clearable
  collapse-tags
  collapse-tags-tooltip
  v-bind="$attrs"
  v-model="modelValue"
  @keyup.enter.stop
  default-first-option
>
  <!--传递插槽-->
  <template
    v-for="(item, key, index) in $slots"
    :key="index"
    v-slot:[key]
  >
    <slot :name="key"></slot>
  </template>
</ElSelectV2>
</template>

<script lang="ts" setup>
import {
  type OptionType,
} from "element-plus/es/components/select-v2/src/select.types";

export type DictModel = {
  id: string;
  lbl: string;
  type: string;
  val: string;
};

type DictModelMap = (item: DictModel) => OptionType;

const props = withDefaults(
  defineProps<{
    modelValue: any;
    code: string;
    placeholder: string;
    dictModelMap?: DictModelMap;
  }>(),
  {
    dictModelMap: function(item: DictModel) {
      if ([ "number", "time", "boolean" ].includes(item.type)) {
        return {
          label: item.lbl,
          value: Number(item.val),
        };
      }
      return {
        label: item.lbl,
        value: item.val,
      };
    },
    placeholder: "请选择",
  },
);

let inited = $ref(false);

let modelValue = $ref(props.modelValue);

let options4SelectV2 = $ref<OptionType[]>([ ]);

watch(
  () => props.modelValue,
  async () => {
    modelValue = props.modelValue;
    await refreshEfc();
  },
  {
    immediate: true,
  },
);

async function refreshEfc() {
  const code = props.code;
  if (!code) {
    inited = false;
    options4SelectV2 = [ ];
    return;
  }
  inited = false;
  const dictModelMap = props.dictModelMap;
  const [ dictModels ] = await getDict([ code ]);
  options4SelectV2 = dictModels.map(dictModelMap);
  // modelValue = "";
  inited = true;
}
</script>
