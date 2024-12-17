<template>
<div
  un-flex="~ [1_0_0]"
  un-overflow-hidden
  un-w="full"
  un-h="full"
  un-p="l-1.5 r-1.5 t-1.5"
  un-box-border
>
  <div
    un-flex="~ col"
    un-overflow-hidden
    un-w="60"
  >
    <div
      un-p="y-1 x-0.5"
      un-box-border
    >
      <CustomInput
        v-model="search_value"
        @clear="onSearchClear"
      >
        <template #prefix>
          <el-icon>
            <ElIconSearch />
          </el-icon>
        </template>
      </CustomInput>
    </div>
    <div
      un-flex="~ [1_0_0] col"
      un-overflow="x-hidden y-auto"
    >
      <el-tree
        ref="treeRef"
        :data="treeData"
        node-key="id"
        :props="{
          label: 'lbl',
          children: 'children',
          'class': nodeClass,
        }"
        :expand-on-click-node="false"
        :highlight-current="true"
        :default-expand-all="true"
        :empty-text="inited ? undefined : ns('加载中...')"
        un-w="full"
        un-m="b-4"
        :filter-node-method="(filterNode as any)"
        @node-click="onNode"
      ></el-tree>
    </div>
  </div>
  <div
    un-flex="~ [1_0_0] col"
    un-overflow-hidden
  >
    <slot
      :show-build-in="props.showBuildIn"
      :parent_id="parent_id"
      :on-find-tree="onFindTree"
      :before-search-reset="beforeSearchReset"
    >
      <List
        :show-build-in="props.showBuildIn || '1'"
        is-pagination="0"
        v-bind="$attrs"
        :parent_id="parent_id"
        @add="onFindTree"
        @edit="onFindTree"
        @remove="onFindTree"
        @revert="onFindTree"
        @refresh="onFindTree"
        @before-search-reset="beforeSearchReset"
      ></List>
    </slot>
  </div>
</div>
</template>

<script lang="ts" setup>
import List from "./List.vue";

import {
  findTree,
  getPagePath,
} from "./Api";

import type {
  TreeNodeData,
  TreeKey,
} from "element-plus/es/components/tree/src/tree.type";

defineOptions({
  name: "菜单",
});

const props = defineProps<{
  parent_id?: MenuId;
  showBuildIn?: string;
}>();

const pagePath = getPagePath();

const {
  ns,
} = useI18n(pagePath);

let inited = $ref(false);

let parent_id = $ref(props.parent_id);

const treeRef = $ref<InstanceType<typeof ElTree>>();

watch(
  () => props.parent_id,
  async () => {
    parent_id = props.parent_id;
    treeRef?.setCurrentKey(parent_id as unknown as TreeKey);
  },
  {
    immediate: true,
  },
);

type ModelTree = Awaited<ReturnType<typeof findTree>>[0];

let treeData = $ref<ModelTree[]>([ ]);

let search_value = $ref("");

let is_clear = false;

watchDebounced(
  $$(search_value),
  () => {
    if (is_clear) {
      is_clear = false;
      return;
    }
    treeRef?.filter(search_value);
  },
  {
    debounce: 200,
  },
);

function onSearchClear() {
  is_clear = true;
  treeRef?.filter(search_value);
}

function filterNode(value: string, data: ModelTree) {
  if (!value) {
    return true;
  }
  return data.lbl.includes(value);
}

function nodeClass(data: TreeNodeData): string {
  if (data.id === parent_id) {
    return "is-current";
  }
  return "";
}

function getById(
  id: MenuId,
  data: ModelTree[],
): ModelTree | undefined {
  for (const item of data) {
    if (item.id === id) {
      return item;
    }
    const node = getById(id, item.children || [ ]);
    if (node) {
      return node;
    }
  }
  return;
}

async function onFindTree() {
  treeData = await findTree();
  if (parent_id) {
    const node = getById(parent_id, treeData);
    if (!node) {
      parent_id = undefined;
    }
  }
  await nextTick();
  treeRef?.filter(search_value);
}

async function onNode(model: ModelTree) {
  parent_id = model.id;
}

function beforeSearchReset() {
  search_value = "";
  parent_id = undefined;
  treeRef?.setCurrentKey(undefined);
}

async function onRefresh() {
  await onFindTree();
}

async function initFrame() {
  await onFindTree();
  inited = true;
}

initFrame();

defineExpose({
  refresh: onRefresh,
});
</script>
