<template>
<view
  un-h="full"
  un-w="full"
  un-cursor="pointer"
  @click="onBeforeOpen"
>
  
  <slot>
    <view>
      {{ modalValue }}
    </view>
  </slot>
  
  <tm-modal
    v-model:show="showModal"
    height="auto"
    :title="props.placeholder"
    :show-close="false"
    :overlay-click="false"
  >
    
    <template #default>
      <view
        un-p="x-2 y-4"
        un-box-border
      >
        
        <view
          un-b="1 solid gray-200"
          un-rounded="4"
          un-bg="white"
        >
          <CustomInput
            v-model="str"
            type="textarea"
            :height="200"
            :placeholder="props.placeholder"
            :readonly="readonly"
            :readonly-placeholder="props.readonlyPlaceholder"
          ></CustomInput>
        </view>
        
      </view>
    </template>
    
    <template #footer>
      <view
        un-flex="~"
        un-gap="x-2"
        un-w="full"
      >
        <tm-button
          un-flex="1"
          block
          color="info"
          @click="onCancel"
        >
          取消
        </tm-button>
        
        <tm-button
          un-flex="1"
          block
          @click="onConfirm"
        >
          确定
        </tm-button>
        
      </view>
    </template>
    
  </tm-modal>
  
</view>
</template>

<script lang="ts" setup>

const props = withDefaults(
  defineProps<{
    placeholder?: string;
    readonly?: boolean | null;
    readonlyPlaceholder?: string;
  }>(),
  {
    placeholder: undefined,
    readonly: undefined,
    readonlyPlaceholder: "",
  },
);

const tmFormItemReadonly = inject<ComputedRef<boolean> | undefined>("tmFormItemReadonly", undefined);

const readonly = $computed(() => {
  if (props.readonly != null) {
    return props.readonly;
  }
  if (tmFormItemReadonly) {
    return tmFormItemReadonly.value;
  }
  return;
});

const modalValue = defineModel<string>({
  default: "",
  type: String,
});

const str = ref<string>(modalValue.value);

watch(
  modalValue,
  () => {
    str.value = modalValue.value;
  },
);

const showModal = ref(false);

function onBeforeOpen() {
  str.value = modalValue.value;
  showModal.value = true;
}

function onCancel() {
  str.value = "";
  showModal.value = false;
}

function onConfirm() {
  modalValue.value = str.value;
  str.value = "";
  showModal.value = false;
}
</script>
