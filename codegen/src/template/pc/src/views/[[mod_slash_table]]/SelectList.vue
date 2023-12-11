<#
let Table_Up = tableUp.split("_").map(function(item) {
  return item.substring(0, 1).toUpperCase() + item.substring(1);
}).join("");
let modelName = "";
let fieldCommentName = "";
let inputName = "";
let searchName = "";
if (/^[A-Za-z]+$/.test(Table_Up.charAt(Table_Up.length - 1))
  && !/^[A-Za-z]+$/.test(Table_Up.charAt(Table_Up.length - 2))
) {
  const Table_Up2 = Table_Up.substring(0, Table_Up.length - 1) + Table_Up.substring(Table_Up.length - 1).toUpperCase();
  modelName = Table_Up2 + "model";
  fieldCommentName = Table_Up2 + "fieldComment";
  inputName = Table_Up2 + "input";
  searchName = Table_Up2 + "search";
} else {
  modelName = Table_Up + "Model";
  fieldCommentName = Table_Up + "FieldComment";
  inputName = Table_Up + "Input";
  searchName = Table_Up + "Search";
}
#><template>
<CustomDialog
  ref="customDialogRef"
  :before-close="beforeClose"
>
  <div
    un-overflow-hidden
    un-flex="~ [1_0_0] row basis-[inherit]"
  ><#
    if (!list_tree) {
    #>
    <List
      v-bind="$attrs"
      :selected-ids="selectedIds"
      @selected-ids-chg="selectedIdsChg"
      :is-multiple="multiple"
      :is-readonly="isReadonly ? '1' : '0'"
      :is-locked="isReadonly ? '1' : '0'"
    ></List><#
    } else {
    #>
    <TreeList
      v-bind="$attrs"
      :selected-ids="selectedIds"
      @selected-ids-chg="selectedIdsChg"
      :is-multiple="multiple"
      :is-readonly="isReadonly ? '1' : '0'"
      :is-locked="isReadonly ? '1' : '0'"
    ></TreeList><#
    }
    #>
  </div>
  <div
    un-p="y-2.5"
    un-flex="~"
    un-justify-center
    un-items-center
  >
    <el-button
      plain
      @click="onClose"
    >
      <template #icon>
        <ElIconCircleClose />
      </template>
      <span>{{ ns("关闭") }}</span>
    </el-button>
    
    <el-button
      plain
      type="primary"
      @click="onSave"
    >
      <template #icon>
        <ElIconCircleCheck />
      </template>
      <span>{{ ns("确定") }}</span>
    </el-button>
  </div>
</CustomDialog>
</template>

<script lang="ts" setup>
import type {
  MaybeRefOrGetter,
  WatchStopHandle,
} from "vue";

import {
  findAll,
} from "./Api";<#
if (!list_tree) {
#>

import List from "./List.vue";<#
} else {
#>

import TreeList from "./TreeList.vue";<#
}
#>

import type {
  <#=Table_Up#>Id,
} from "@/typings/ids";

import type {
  <#=modelName#>,
} from "#/types";

const emit = defineEmits<{
  (e: "change", value?: <#=modelName#> | (<#=modelName#> | undefined)[] | null): void,
}>();

const {
  n,
  ns,
} = useI18n("/<#=mod#>/<#=table#>");

let inited = $ref(false);

let dialogAction = $ref("select");

type OnCloseResolveType = {
  type: "ok" | "cancel";
  selectedIds: <#=Table_Up#>Id[];
};

let onCloseResolve = function(_value: OnCloseResolveType) { };

let customDialogRef = $ref<InstanceType<typeof CustomDialog>>();

let selectedIds = $ref<<#=Table_Up#>Id[]>([ ]);

let multiple = $ref(false);

let isReadonly = $ref(false);

let readonlyWatchStop: WatchStopHandle | undefined = undefined;

/** 打开对话框 */
async function showDialog(
  arg?: {
    title?: string;
    multiple?: boolean;
    isReadonly?: MaybeRefOrGetter<boolean>;
    model?: {
      ids?: <#=Table_Up#>Id[];
    };
    action?: typeof dialogAction;
  },
) {
  inited = false;
  const title = arg?.title;
  const dialogRes = customDialogRef!.showDialog<OnCloseResolveType>({
    type: "medium",
    title,
  });
  onCloseResolve = dialogRes.onCloseResolve;
  const model = arg?.model;
  const action = arg?.action;
  if (readonlyWatchStop) {
    readonlyWatchStop();
  }
  readonlyWatchStop = watchEffect(function() {
    isReadonly = toValue(arg?.isReadonly) ?? false;
  });
  dialogAction = action || "select";
  
  if (arg?.multiple != null) {
    multiple = arg.multiple;
  }
  
  selectedIds = model?.ids || [ ];
  
  inited = true;
  return await dialogRes.dialogPrm;
}

function selectedIdsChg(value: <#=Table_Up#>Id[]) {
  selectedIds = value;
}

async function getModelsByIds(ids: <#=Table_Up#>Id[]) {
  const res = await findAll(
    {
      ids,
    },
  );
  return res;
}

/** 确定 */
async function onSave() {
  onCloseResolve({
    type: "ok",
    selectedIds,
  });
  const models = await getModelsByIds(selectedIds);
  emit("change", models);
}

/** 点击取消关闭按钮 */
async function onClose() {
  if (readonlyWatchStop) {
    readonlyWatchStop();
  }
  onCloseResolve({
    type: "cancel",
    selectedIds,
  });
}

async function beforeClose(done: (cancel: boolean) => void) {
  if (readonlyWatchStop) {
    readonlyWatchStop();
  }
  done(false);
  onCloseResolve({
    type: "cancel",
    selectedIds,
  });
}

defineExpose({
  showDialog,
  getModelsByIds,
});
</script>
