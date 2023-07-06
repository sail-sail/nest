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
  Table_Up = Table_Up.substring(0, Table_Up.length - 1) + Table_Up.substring(Table_Up.length - 1).toUpperCase();
  modelName = Table_Up + "model";
  fieldCommentName = Table_Up + "fieldComment";
  inputName = Table_Up + "input";
  searchName = Table_Up + "search";
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
      :selected-ids="selectedIds"
      @selected-ids-chg="selectedIdsChg"
      :is-multiple="multiple"
      :is-readonly="isReadonly ? '1' : '0'"
      :is-locked="isReadonly ? '1' : '0'"
    ></List><#
    } else {
    #>
    <TreeList
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
      @click="closeClk"
    >
      <template #icon>
        <ElIconCircleClose />
      </template>
      <span>{{ ns("取消") }}</span>
    </el-button>
    
    <el-button
      plain
      type="primary"
      @click="saveClk"
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
import {
  type MaybeRefOrGetter,
  type WatchStopHandle,
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

import {
  type <#=modelName#>,
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
  selectedIds: string[];
};

let onCloseResolve = function(_value: OnCloseResolveType) { };

let customDialogRef = $ref<InstanceType<typeof CustomDialog>>();

let selectedIds = $ref<string[]>([ ]);

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
      ids?: string[];
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

function selectedIdsChg(value: string[]) {
  selectedIds = value;
}

async function getModelsByIds(ids: string[]) {
  const res = await findAll(
    {
      ids,
    },
  );
  return res;
}

/** 确定 */
async function saveClk() {
  onCloseResolve({
    type: "ok",
    selectedIds,
  });
  const models = await getModelsByIds(selectedIds);
  emit("change", models);
}

/** 点击取消关闭按钮 */
async function closeClk() {
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
