<template>
<tm-between-time
  v-model="modelValue"
  format-sync-value
  un-cursor="pointer"
  class="custom_date"
  :class="{
    'custom_between_date_readonly': _readonly,
    'custom_between_date_page_inited': props.pageInited,
  }"
  :disabled="_readonly"
  :start="_start"
  :end="_end"
  v-bind="$attrs"
  @confirm="onConfirm"
>
  <slot>
    <view
      un-flex="~"
      un-items="center"
      un-justify="between"
      un-w="full"
      un-h="11"
    >
      <view
        un-flex="~ [1_0_0]"
        un-items="center"
        un-gap="x-1"
        un-m="x-2"
        un-overflow-hidden
      >
        <view
          v-if="!modelValue[0] && !modelValue[1] && props.pageInited"
        >
          <view
            v-if="!_readonly"
            un-text="[var(--color-placeholder)]"
          >
            {{ props.placeholder }}
          </view>

          <view
            v-else
            un-text="[var(--color-placeholder)]"
          >
            {{ props.readonlyPlaceholder }}
          </view>
        </view>

        <template
          v-else-if="modelValue[0] !== modelValue[1]"
        >
          <view>
            {{ modelValue[0] || '以前' }}
          </view>

          <view>
            ~
          </view>

          <view>
            {{ modelValue[1] || '以后' }}
          </view>
        </template>

        <template
          v-else
        >
          <view>
            {{ modelValue[0] }}
          </view>
        </template>
      </view>

      <view
        v-if="showClear"
        un-flex="~"
        un-items="center"
        un-m="r-2"
        un-cursor="pointer"
        @tap.stop=""
        @click="onClear"
      >
        <tm-icon
          _style="transition:color 0.24s"
          :size="30"
          color="#b1b1b1"
          name="close-circle-fill"
          @tap.stop=""
          @click="onClear"
        />
      </view>
    </view>
  </slot>
</tm-between-time>
</template>

<script lang="ts" setup>

const props = withDefaults(
  defineProps<{
    readonly?: boolean;
    pageInited?: boolean;
    clearable?: boolean;
    placeholder?: string;
    readonlyPlaceholder?: string;
    start?: string;
    end?: string;
  }>(),
  {
    readonly: undefined,
    pageInited: true,
    clearable: undefined,
    placeholder: "(全部)",
    readonlyPlaceholder: "(全部)",
    start: undefined,
    end: undefined,
  },
);

const emit = defineEmits<{
  (e: "change", value?: string[]): void;
  (e: "confirm", value?: string[]): void;
  (e: "clear"): void;
}>();

const tmFormItemReadonly = inject<ComputedRef<boolean> | undefined>("tmFormItemReadonly", undefined);

const _readonly = $computed(() => {
  if (props.readonly != null) {
    return props.readonly;
  }
  if (tmFormItemReadonly) {
    return tmFormItemReadonly.value;
  }
  return;
});

// start 跟 end 模拟设置为 3 年内的日期范围
const _start = $computed(() => {
  if (props.start) {
    return props.start;
  }
  const date = dayjs().subtract(3, "year");
  if (date.isValid()) {
    return date.format("YYYY-MM-DD");
  }
});

const _end = $computed(() => {
  if (props.end) {
    return props.end;
  }
  const date = dayjs();
  if (date.isValid()) {
    return date.format("YYYY-MM-DD");
  }
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const modelValue = defineModel<any[]>({
  type: Array,
  default: () => [null, null],
});

const showClear = $computed(() => {
  if (_readonly) {
    return false;
  }
  if (props.clearable != null) {
    return props.clearable && hasValue;
  }
  return hasValue;
});

const hasValue = $computed(() => {
  if (!Array.isArray(modelValue.value)) {
    return false;
  }
  return modelValue.value.some((item) => item != null && item !== "");
});

function onClear() {
  modelValue.value = [];
  emit("change", []);
  emit("confirm", []);
  emit("clear");
}

function onConfirm(value: string[]) {
  emit("change", value);
  emit("confirm", value);
}
</script>

<style lang="scss" scoped>
.custom_between_date_readonly {
  cursor: default;
}
</style>
