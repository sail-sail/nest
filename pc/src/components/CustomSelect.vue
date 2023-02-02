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

const usrStore = useUsrStore();

let inited = $ref(false);

type OptionsMap = (item: any) => OptionType;

let data = $ref<any[]>([ ]);

let options4SelectV2 = $ref<(OptionType & { __pinyin_label?: string })[]>([ ]);

const props = withDefaults(
  defineProps<{
    method: () => Promise<any[]>; // 用于获取数据的方法
    optionsMap?: OptionsMap;
    pinyinFilterable?: boolean;
    height?: number;
  }>(),
  {
    optionsMap: function(item: any) {
      const item2 = item as { lbl: string; id: string; };
      return {
        label: item2.lbl,
        value: item2.id,
      };
    },
    pinyinFilterable: true,
    height: 300,
  },
);

function filterMethod(value: string) {
  options4SelectV2 = data.map((item) => {
    const item2 = props.optionsMap(item);
    item2.__pinyin_label = (item as any).__pinyin_label;
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
  const method = props.method;
  if (!method) {
    inited = false;
    return;
  }
  inited = false;
  data = await method();
  options4SelectV2 = data.map(props.optionsMap);
  if (props.pinyinFilterable) {
    for (let i = 0; i < options4SelectV2.length; i++) {
      const item = options4SelectV2[i];
      if (item.label) {
        (data as any)[i].__pinyin_label = pinyin(item.label, { pattern: "first", toneType: "none", type: "array" }).join("");
      }
    }
  }
  inited = true;
}

refreshEfc();

usrStore.onLogin(refreshEfc);
</script>
