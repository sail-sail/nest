<#
const hasEnabled = columns.some(function (column) { return column.COLUMN_NAME === "is_enabled" });
let Table_Up = tableUp.split("_").map(function(item) {
  return item.substring(0, 1).toUpperCase() + item.substring(1);
}).join("");
let modelName = "";
let fieldCommentName = "";
let inputName = "";
let searchName = "";
let modelNameTree = "";
if (/^[A-Za-z]+$/.test(Table_Up.charAt(Table_Up.length - 1))
  && !/^[A-Za-z]+$/.test(Table_Up.charAt(Table_Up.length - 2))
) {
  modelName = Table_Up + "model";
  fieldCommentName = Table_Up + "fieldComment";
  inputName = Table_Up + "input";
  searchName = Table_Up + "search";
  modelNameTree = Table_Up + "modelTree";
} else {
  modelName = Table_Up + "Model";
  fieldCommentName = Table_Up + "FieldComment";
  inputName = Table_Up + "Input";
  searchName = Table_Up + "Search";
  modelNameTree = Table_Up + "ModelTree";
}
const list_tree = opts?.list_tree;
let list_treeColumn = undefined;
let list_treeForeignKey = undefined;
let list_treeForeignTable = undefined;
if (typeof list_tree === "string") {
  list_treeColumn = columns.find((item) => item.COLUMN_NAME === list_tree);
  list_treeForeignKey = list_treeColumn?.foreignKey;
  if (!list_treeForeignKey) {
    throw `表: ${ mod_table } 中的 list_tree 对应的外键字段: ${ list_tree } 不存在`;
  }
  list_treeForeignTable = optTables[list_treeForeignKey.mod + "_" + list_treeForeignKey.table];
}
#><template>
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
          label: '<#=list_treeForeignKey?.lbl || "lbl"#>',
          children: 'children',
          'class': nodeClass,
        }"
        :expand-on-click-node="false"
        :highlight-current="true"
        :default-expand-all="true"<#
        if (isUseI18n) {
        #>
        :empty-text="inited ? undefined : ns('加载中...')"<#
        } else {
        #>
        :empty-text="inited ? undefined : '加载中...'"<#
        }
        #>
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
      :<#=list_tree === true ? "parent_id" : list_treeColumn.COLUMN_NAME#>="parent_id"
      :on-find-tree="onFindTree"
      :before-search-reset="beforeSearchReset"
    >
      <List
        :show-build-in="props.showBuildIn || '1'"<#
        if (list_tree === true) {
        #>
        is-pagination="0"<#
        }
        #>
        v-bind="$attrs"
        :<#=list_tree === true ? "parent_id" : list_treeColumn.COLUMN_NAME#>="parent_id"
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
import List from "./List.vue";<#
const old_Table_Up = Table_Up;
if (list_tree === true) {
#>

import {
  findTree<#=Table_Up#>,
  getPagePath<#=Table_Up#>,
} from "./Api";<#
} else {
  Table_Up = list_treeForeignKey.table.split("_").map(function(item) {
    return item.substring(0, 1).toUpperCase() + item.substring(1);
  }).join("");
#>

import {
  getPagePath<#=old_Table_Up#>,
} from "./Api.ts";

import {
  findTree<#=Table_Up#>,<#
  if (mod === "base" && table === "data_permit") {
  #>
  useMenuTreeFilter,<#
  }
  #>
} from "@/views/<#=list_treeForeignKey.mod#>/<#=list_treeForeignKey.table#>/Api.ts";<#
}
#>

import type {
  TreeNodeData,
  TreeKey,
} from "element-plus/es/components/tree/src/tree.type";

defineOptions({
  name: "<#=table_comment#>TreeList",
});

const props = defineProps<{
  parent_id?: <#=Table_Up#>Id;
  showBuildIn?: string;
}>();

const pagePath = getPagePath<#=old_Table_Up#>();<#
if (isUseI18n) {
#>

const {
  ns,
} = useI18n(pagePath);<#
}
#>

let inited = $ref(false);

let parent_id = $ref(props.parent_id);

const treeRef = $(useTemplateRef("treeRef"));

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

type ModelTree = Awaited<ReturnType<typeof findTree<#=Table_Up#>>>[0];

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

function filterNode(value: string, data: ModelTree) {<#
  if (mod === "base" && table === "data_permit") {
  #>
  const isPermit = useMenuTreeFilter(value, data);
  if (isPermit !== true) {
    return false;
  }<#
  }
  #>
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
  id: <#=Table_Up#>Id,
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
  treeData = await findTree<#=Table_Up#>(<#
  if (list_treeForeignTable && list_treeForeignTable.columns.some(function (item) { return item.COLUMN_NAME === "is_enabled" })) {
  #>{ is_enabled: [ 1 ] }<#
  }
  #>);
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
