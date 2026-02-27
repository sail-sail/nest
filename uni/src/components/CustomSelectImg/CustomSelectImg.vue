<template>
<CustomSelectModal
  v-bind="$attrs"
  v-model="modelValue"
  v-model:model-label="modelLabel"
  :hide-search="true"
  :options-map="props.optionsMap"
  height="90%"
  class="custom_select_img"
  @change="onChange"
  @data="onData"
  @confirm="onConfirm"
  @clear="onClear"
>
  
  <template
    #option="{
      optionsComputed,
      selectedValue,
      onSelect,
    }"
  >
    
    <view
      un-w="full"
      un-grid="~ cols-[repeat(2,1fr)]"
      un-gap="x-2 y-2"
      un-p="2"
      un-box-border
      class="custom_select_img_option_list"
    >
      
      <view
        v-for="item of optionsComputed"
        :id="'a' + item.value"
        :key="item.value"
        :title="item.label"
        un-flex="~ [1_0_0] col"
        un-overflow-hidden
        un-b="1 solid [var(--color-border)]"
        un-aspect="[1/1.3]"
        un-rounded="md"
        un-cursor="pointer"
        un-transition="all duration-200"
        un-relative
        :style="{
          'color': selectedValue.includes(item.value) ? '#0579ff' : undefined,
          'border-color': selectedValue.includes(item.value) ? '#0579ff' : 'var(--color-border)',
        }"
        @click="onSelect(item.value)"
      >
        
        <view
          un-w="full"
          un-aspect="square"
          un-rounded="t-md"
          un-flex="~"
          un-justify="center"
          un-items="center"
          un-b="0 solid [var(--color-border)]"
          :style="{
            'border-bottom-width': !item.image ? '1px' : '0',
          }"
        >
          
          <view
            v-if="item.image"
            un-rounded="t-md"
            un-w="full"
            un-h="full"
            un-overflow="hidden"
          >
            
            <image
              mode="aspectFill"
              un-rounded="t-md"
              un-w="full"
              un-h="full"
              webp
              :src="item.image"
            ></image>
            
          </view>
          
          <view
            v-else
            un-i="iconfont-picture"
            un-text="7 [var(--color-placeholder)]"
          ></view>
          
        </view>
        
        <slot
          name="option-label"
          :item="item"
          :data="data"
          :model="data.find((x) => props.optionsMap(x).value === item.value)!"
          :is-selected="selectedValue.includes(item.value)"
        >
          
          <view
            un-flex="~ [1_0_0]"
            un-justify="center"
            un-items="center"
            un-rounded="b-md"
            un-p="x-1 y-0.5"
            un-box-border
            un-text="ellipsis [var(--font-size-sm)]"
          >
            {{ item.label }}
          </view>
          
        </slot>
        
        <view
          v-if="selectedValue.includes(item.value)"
          un-absolute
          un-top="1"
          un-right="1"
          un-w="5"
          un-h="5"
          un-bg="[var(--color-primary)]"
          un-rounded="full"
          un-flex="~"
          un-justify="center"
          un-items="center"
          un-text="xs white"
        >
          ✓
        </view>
        
      </view>
      
    </view>
    
  </template>
  
</CustomSelectModal>
</template>

<script lang="ts" setup>

type OptionType = {
  label: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: any;
  image?: string;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type OptionsMap = (item: any) => OptionType;

const props = withDefaults(
  defineProps<{
    optionsMap?: OptionsMap;
  }>(),
  {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    optionsMap: function(item: any) {
      const item2 = item as { lbl: string; id: string; img_lbl?: string };
      return {
        label: item2.lbl,
        value: item2.id,
        image: item2.img_lbl,
      };
    },
  },
);

const emit = defineEmits<{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (e: "data", data: any[]): void,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (e: "confirm", value?: any): void,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (e: "change", value: any): void,
  (e: "clear"): void,
}>();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const modelValue = defineModel<any>();
const modelLabel = defineModel<string | null>("modelLabel");

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function onChange(value: any | any[] | null) {
  emit("change", value);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function onConfirm(value?: any) {
  emit("confirm", value);
}

function onClear() {
  emit("clear");
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let data = $ref<any[]>([ ]);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function onData(data0: any[]) {
  data = data0;
  emit("data", data0);
}

</script>
