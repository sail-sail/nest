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
      <el-input
        v-model="search_value"
        :clearable="true"
        un-w="full"
        @clear="searchClr"
      >
        <template #prefix>
          <el-icon>
            <ElIconSearch />
          </el-icon>
        </template>
      </el-input>
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
        :filter-node-method="filterNode"
        @node-click="nodeClk"
      ></el-tree>
    </div>
  </div>
  <div
    un-flex="~ [1_0_0] col"
    un-overflow-hidden
  >
    <List
      ref="listRef"
      show-build-in="1"
      is-pagination="0"
      v-bind="$attrs"
      :parent_id="parent_id"
      @add="findTreeEfc"
      @edit="findTreeEfc"
      @remove="findTreeEfc"
      @revert="findTreeEfc"
      @refresh="findTreeEfc"
      @before-search-reset="beforeSearchReset"
    ></List>
  </div>
</div>
</template>

<script lang="ts" setup>
import List from "./List.vue";

import {
  findTree,
  type MenuModelTree,
} from "./Api";

import {
  type TreeNodeData,
} from "element-plus/es/components/tree/src/tree.type";

defineOptions({
  name: "菜单",
});

const props = defineProps<{
  parent_id?: string;
}>();

const {
  ns,
} = useI18n("/base/menu");

let inited = $ref(false);

let listRef = $ref<InstanceType<typeof List>>();

let parent_id = $ref(props.parent_id);

let treeRef = $ref<InstanceType<typeof ElTree>>();

watch(
  () => props.parent_id,
  async () => {
    parent_id = props.parent_id;
    treeRef?.setCurrentKey(parent_id);
    if (parent_id) {
      await listRef?.refresh?.();
    }
  },
  {
    immediate: true,
  },
);

let treeData = $ref<Awaited<ReturnType<typeof findTree>>>([ ]);

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

function searchClr() {
  is_clear = true;
  treeRef?.filter(search_value);
}

function filterNode(value: string, data: MenuModelTree) {
  if (!value) {
    return true;
  }
  return data.lbl.includes(value);
}

function nodeClass(data: TreeNodeData, _: any): string {
  if (data.id === parent_id) {
    return "is-current";
  }
  return "";
}

function getById(
  id: string,
  data: MenuModelTree[],
): MenuModelTree | undefined {
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

async function findTreeEfc() {
  treeData = await findTree();
  if (parent_id) {
    const node = getById(parent_id, treeData);
    if (!node) {
      parent_id = "";
    }
  }
}

async function nodeClk(model: MenuModelTree) {
  parent_id = model.id;
}

function beforeSearchReset() {
  search_value = "";
  parent_id = "";
  treeRef?.setCurrentKey(undefined);
}

async function refreshClk() {
  await Promise.all([
    listRef?.refresh?.(),
    findTreeEfc(),
  ]);
}

async function initFrame() {
  await findTreeEfc();
  inited = true;
}

initFrame();

defineExpose({
  refresh: refreshClk,
});
</script>
