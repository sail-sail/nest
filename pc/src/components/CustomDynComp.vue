<template>
<component
  :is="component"
  v-if="component"
  v-bind="$attrs"
></component>
</template>

<script lang="ts" setup>
import componentMap from "./ComponentMap.ts";

const props = withDefaults(
  defineProps<{
    name: string;
  }>(),
  {
  },
);

const component = computed(() => {
  const loader = componentMap[props.name];
  if (!loader) {
    console.warn(`Component not found in whitelist: ${props.name}`);
    return null;
  }
  return defineAsyncComponent(loader);
});

</script>
