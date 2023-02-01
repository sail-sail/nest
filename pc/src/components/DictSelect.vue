<template>
<ElSelectV2
  :options="options4SelectV2"
  filterable
  clearable
  collapse-tags
  collapse-tags-tooltip
  default-first-option
  v-bind="$attrs"
  @keyup.enter.stop
  :loading="!inited"
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

type OptionsMap = (item: DictModel) => OptionType;

const props = withDefaults(
  defineProps<{
    code: string;
    optionsMap?: OptionsMap;
  }>(),
  {
    optionsMap: function(item: DictModel) {
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
  },
);

let inited = $ref(false);

let options4SelectV2 = $computed(() => dictModels.map(props.optionsMap));

let dictModels = $ref<DictModel[]>([ ]);

async function refreshEfc() {
  const code = props.code;
  if (!code) {
    inited = false;
    dictModels = [ ];
    return;
  }
  inited = false;
  [ dictModels ] = await getDict([ code ]);
  inited = true;
}

watch(
  () => props.code,
  async () => {
    await refreshEfc();
  },
  {
    immediate: true,
  },
);
</script>
