<template>
<view
  un-flex="~ [1_0_0] col"
  un-overflow-auto
>
  <tm-form
    ref="formRef"
    v-bind="$attrs"
    :margin="props.margin"
    :padding="props.padding"
    :transprent="props.transprent"
  >
    <template #default>
      <slot name="default"></slot>
    </template>
  </tm-form>
</view>
</template>

<script lang="ts" setup>

let formRef = $ref<InstanceType<typeof TmForm>>();

const props = withDefaults(
  defineProps<{
    margin?: number[];
    padding?: number[];
    transprent?: boolean;
  }>(),
  {
    margin: () => [0, 0],
    padding: () => [0, 0],
    transprent: true,
  },
);

const tmFormComnameId = "tmFormId";

const validate = (...args: any) => {
  return formRef!.validate.apply(formRef, args);
};

const reset = (...args: any) => {
  return formRef!.reset.apply(formRef, args);
};

const clearValidate = (...args: any) => {
  return formRef!.clearValidate.apply(formRef, args);
};

const submit = (...args: any) => {
  return formRef!.submit.apply(formRef, args);
};

const pushKey = (...args: any) => {
  return formRef!.pushKey.apply(formRef, args);
};

const delKey = (...args: any) => {
  return formRef!.delKey.apply(formRef, args);
};

defineExpose({
  reset,
  validate,
  clearValidate,
  submit,
  pushKey,
  delKey,
  tmFormComnameId,
});
</script>
