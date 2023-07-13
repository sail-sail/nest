<!--
 * 基于 el+ 的车牌选择器
 * @author: jinweibin
 * @since: 2023-07-08
 * CarNumberInput.vue
-->
<template>
  <el-input
    v-if="readonly !== true"
    class="custom_input"
    un-w="full"
    v-bind="$attrs"
    v-model="modelValue"
    :clearable="!props.disabled"
    :disabled="props.disabled"
    :maxlength="8"
    @change="valueChg"
    @clear="clearClk"
    @focus="show"
  >
    <template
      v-for="(item, key, index) in $slots"
      :key="index"
      #[key]
    >
      <slot :name="key"></slot>
    </template>
  </el-input>
  <template
    v-else
  >
    <div
      un-b="1 solid [var(--el-border-color)]"
      un-p="x-2.75 y-1"
      un-box-border
      un-rounded
      un-m="l-1"
      un-w="full"
      un-min="h-8"
      un-line-height="normal"
      un-break-words
      class="custom_select_readonly"
      v-bind="$attrs"
    >
      {{ modelValue ?? "" }}
    </div>
  </template>
  

  <VehicleNumberKeyboard
    id="keyboard"
    v-if="visible"
    :layout="layout"
    v-model:default-keyset="defaultKeySet"
    :cancel="hide"
    :accept="accept"
    :input="input"
    :next="next"
    :change="change"
    :options="options"
    >
  </VehicleNumberKeyboard>
</template>
  
  <script lang="ts" setup>
  const emit = defineEmits<{
    (e: "update:modelValue", value?: any): void,
    (e: "change", value?: any): void,
    (e: "clear"): void,
  }>();
  
  const props = withDefaults(
    defineProps<{
      modelValue?: any;
      disabled?: boolean;
      readonly?: boolean;
    }>(),
    {
      modelValue: undefined,
      disabled: undefined,
      readonly: undefined,
    },
  );
  
  let modelValue = $ref(props.modelValue);
  
  watch(
    () => props.modelValue,
    () => {
      modelValue = props.modelValue;
    },
  );
  let input = $ref(null);
  let layout = $ref("carno");
  let visible = $ref(false);
  let options = $ref({
    useKbEvents: false
  });
  let defaultKeySet = $ref('city');
  function valueChg() {
    emit("update:modelValue", modelValue);
    emit("change", modelValue);
  }
  
  function clearClk() {
    modelValue = "";
    emit("update:modelValue", modelValue);
    emit("clear");
  }

  function accept(text: string) {
    console.log("Input text: " + text);
          hide();
  }
  function show(e: any) {
    input = e.target;

    if (!visible)
      visible = true
  }
  function hide() {
    visible = false;
  }
  function next() {
  }
  function change(e: any) {
    emit("update:modelValue", e);
    emit("change", e);
  }
  </script>
  <style>
#keyboard {
	position: fixed;
	left: 0;
	right: 0;
	bottom: 0;

	z-index: 1000;
	width: 100%;
	max-width: 1000px;
	margin: 0 auto;

	padding: 1em;

	background-color: #EEE;
	box-shadow: 0px -3px 10px rgba(black, 0.3);

	border-radius: 10px;
}</style>
  