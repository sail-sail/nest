<template>
<div
  un-w="full"
>
  <template
    v-if="isImageType"
  >
    <UploadImage
      v-model="imageValue"
      :readonly="props.readonly"
      :page-inited="props.pageInited"
      :max-size="20"
      db="nuxt_comp_cnf.val"
      :is-public="true"
    ></UploadImage>
  </template>
  
  <template v-else>
    <CustomInput
      v-model="textValue"
      :type="isTextareaType ? 'textarea' : 'text'"
      :placeholder="props.placeholder"
      :readonly="props.readonly"
      :autosize="isTextareaType ? { minRows: 2, maxRows: 6 } : undefined"
      @keyup.enter.stop
    ></CustomInput>
  </template>
  
</div>
</template>

<script lang="ts" setup>
import type {
  InputMaybe,
} from "#/types";

const emit = defineEmits<{
  (e: "update:modelValue", value?: string | null): void,
}>();

const props = withDefaults(
  defineProps<{
    modelValue?: InputMaybe<string>;
    type?: string | null;
    readonly?: boolean;
    placeholder?: string;
    pageInited?: boolean;
  }>(),
  {
    modelValue: undefined,
    type: "text",
    readonly: false,
    placeholder: "请输入 值",
    pageInited: false,
  },
);

function safeParseJson(value?: string | null) {
  if (value == null || value === "") {
    return undefined;
  }
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
}

const isImageType = $computed(() => props.type === "image");
const isTextareaType = $computed(() => props.type === "textarea");

let textValue = $ref<string>("");
let imageValue = $ref<string>("");

function syncFromModelValue(value?: string | null) {
  const parsed = safeParseJson(value);
  if (isImageType) {
    if (Array.isArray(parsed)) {
      imageValue = parsed.join(",");
    } else if (typeof parsed === "string") {
      imageValue = parsed;
    } else {
      imageValue = "";
    }
    return;
  }
  textValue = typeof parsed === "string" ? parsed : (parsed == null ? "" : String(parsed));
}

watch(
  () => props.modelValue,
  (value) => {
    syncFromModelValue(value);
  },
  {
    immediate: true,
  },
);

watch(
  () => textValue,
  (value) => {
    emit("update:modelValue", JSON.stringify(value));
  },
);

watch(
  () => imageValue,
  (value) => {
    const ids = value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
    emit("update:modelValue", JSON.stringify(ids));
  },
);
</script>
