<template>
<ElSelectV2
  :options="options4SelectV2"
  filterable
  clearable
  collapse-tags
  collapse-tags-tooltip
  default-first-option
  :height="props.height"
  :remote="props.pinyinFilterable"
  :remote-method="filterMethod"
  @visible-change="handleVisibleChange"
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
import { pinyin } from "pinyin-pro";

import {
  type OptionType,
} from "element-plus/es/components/select-v2/src/select.types";

export type DictModel = {
  id: string;
  lbl: string;
  type: string;
  val: string;
  __pinyin_label?: string;
};

type OptionsMap = (item: DictModel) => OptionType;

const props = withDefaults(
  defineProps<{
    code: string;
    optionsMap?: OptionsMap;
    pinyinFilterable?: boolean;
    height?: number;
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
    pinyinFilterable: true,
    height: 300,
  },
);

let inited = $ref(false);

let options4SelectV2 = $ref<(OptionType & { __pinyin_label?: string })[]>([ ]);

let dictModels = $ref<DictModel[]>([ ]);

function filterMethod(value: string) {
  options4SelectV2 = dictModels.map((item) => {
    const item2 = props.optionsMap(item);
    item2.__pinyin_label = item.__pinyin_label;
    return item2;
  });
  if (isEmpty(value)) {
    return;
  }
  options4SelectV2 = options4SelectV2.filter((item) => {
    return item.label.includes(value)
    || (item.__pinyin_label && item.__pinyin_label.includes(value));
  });
}

function handleVisibleChange(visible: boolean) {
  if (!props.pinyinFilterable) {
    return;
  }
  if (visible) {
    filterMethod("");
  }
}

async function refreshEfc() {
  const code = props.code;
  if (!code) {
    inited = false;
    dictModels = [ ];
    return;
  }
  inited = false;
  [ dictModels ] = await getDict([ code ]);
  options4SelectV2 = dictModels.map(props.optionsMap);
  if (props.pinyinFilterable) {
    for (let i = 0; i < options4SelectV2.length; i++) {
      const item = options4SelectV2[i];
      if (item.label) {
        dictModels[i].__pinyin_label = pinyin(item.label, { pattern: "first", toneType: "none", type: "array" }).join("");
      }
    }
  }
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
