<template>
<CustomDialog
  ref="customDialogRef"
  :before-close="beforeClose"
  @opened="onOpened"
>
  <div
    un-flex="~ [1_0_0] col basis-[inherit]"
    un-overflow-hidden
  >
    <div
      un-flex="~ [1_0_0] col basis-[inherit]"
      un-overflow-auto
      un-p="10"
      un-justify-start
      un-items-center
    >
      <el-form
        ref="formRef"
        size="default"
        label-width="60"
        
        un-grid="~ cols-[repeat(1,380px)]"
        un-gap="x-2 y-4"
        un-justify-items-end
        un-items-center
        
        :model="dialogModel"
        :rules="form_rules"
        :validate-on-rule-change="false"
      >
        
        <el-form-item
          :label="ns('名称')"
          prop="name"
        >
          <CustomInput
            ref="inputRef"
            v-model="dialogModel.name"
          ></CustomInput>
        </el-form-item>
        
      </el-form>
        
      <div
        un-m="t-2"
        
        un-grid="~ cols-[repeat(1,380px)]"
        un-gap="x-2 y-4"
        un-justify-items-center
        un-items-center
      >
        <div
          v-for="(item, i) of searchList"
          :key="item.name + '__' + i"
          un-flex="~"
          un-gap="x-1"
          un-w="full"
          un-p="l-[60px]"
          un-box="border"
        >
          <div>
            {{ i + 1 }}.
          </div>
          <div>
            {{ item.name }}
          </div>
          <div
            un-m="l-2"
            un-flex="~"
            un-items-end
            un-cursor-pointer
            @click="onDelete(item.name, i)"
          >
            <el-icon
              un-text="red"
            >
              <ElIconCircleClose></ElIconCircleClose>
            </el-icon>
          </div>
        </div>
      </div>
      
    </div>
    <div
      un-p="y-5"
      un-flex
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
        <span>{{ ns('关闭') }}</span>
      </el-button>
      
      <el-button
        plain
        type="primary"
        @click="onSave"
      >
        <template #icon>
          <ElIconCircleCheck />
        </template>
        <span>{{ ns('保存') }}</span>
      </el-button>
      
    </div>
  </div>
</CustomDialog>
</template>

<script lang="ts" setup>

const {
  ns,
  nsAsync,
} = useI18n();

let inited = $ref(false);

let dialogTitle = $ref("查询条件暂存");

let dialogModel = $ref({
  name: "",
} as SearchStagingType);

let persistKey = "";

const formRef = $ref<InstanceType<typeof ElForm>>();

/** 表单校验 */
let form_rules = $ref<Record<string, FormItemRule[]>>({ });

watchEffect(async () => {
  if (!inited) {
    form_rules = { };
    return;
  }
  await nextTick();
  form_rules = {
    // 名称
    // name: [
    //   {
    //     required: true,
    //     message: `${ await nsAsync("请输入") } ${ ns("名称") }`,
    //   },
    // ],
  };
});

type OnCloseResolveType = {
  type: "ok" | "cancel";
};

let onCloseResolve = function(_value: OnCloseResolveType) { };

const customDialogRef = $ref<InstanceType<typeof CustomDialog>>();

const inputRef = $ref<InstanceType<typeof ElInput>>();

async function showDialog(
  arg?: {
    title?: string;
    model: {
      persistKey: string;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      search: any;
    },
  },
) {
  inited = false;
  dialogTitle = arg?.title ?? "";
  persistKey = arg?.model.persistKey ?? "";
  if (!persistKey) {
    throw new Error("persistKey is required");
  }
  const dialogRes = customDialogRef!.showDialog<OnCloseResolveType>({
    type: "auto",
    title: $$(dialogTitle),
    pointerPierce: true,
  });
  onCloseResolve = dialogRes.onCloseResolve;
  dialogModel = {
    name: "",
    value: arg?.model?.search ?? { },
  };
  initName();
  onRefresh();
  inited = true;
  return await dialogRes.dialogPrm;
}

function initName() {
  const search = dialogModel.value;
  let name = "";
  const keys = Object.keys(search);
  for (const key of keys) {
    const val = search[key];
    if (typeof val !== "string") {
      continue;
    }
    if (!val) {
      continue;
    }
    name += val + "/";
  }
  if (name.endsWith("/")) {
    name = name.substring(0, name.length - 1);
  }
  dialogModel.name = name;
}

function onOpened() {
  inputRef?.focus();
}

export type SearchStagingType = {
  name: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: any;
};

let searchList = $ref<SearchStagingType[]>([ ]);

function onRefresh() {
  const searchListStr = localStorage.getItem(persistKey);
  if (searchListStr) {
    try {
      searchList = JSON.parse(searchListStr);
      searchList = searchList || [ ];
    } catch (e) {
      console.error(e);
      searchList = [ ];
    }
  }
}

function save(model: SearchStagingType) {
  if (model.name) {
    const searchList2 = [ ];
    for (const item of searchList) {
      if (item.name === model.name) {
        continue;
      }
      searchList2.push(item);
    }
    searchList = searchList2;
    searchList.push(model);
  }
  localStorage.setItem(persistKey, JSON.stringify(searchList));
}

async function onDelete(name: string, k: number) {
  // try {
  //   await ElMessageBox.confirm(`${ await nsAsync("确定删除 {0}", name) }`, {
  //     confirmButtonText: await nsAsync("确定"),
  //     cancelButtonText: await nsAsync("取消"),
  //     type: "warning",
  //   });
  // } catch(err) {
  //   return;
  // }
  const searchList2 = [ ];
  for (let i = 0; i < searchList.length; i++) {
    const item = searchList[i];
    if (i === k) {
      continue;
    }
    searchList2.push(item);
  }
  searchList = searchList2;
  // localStorage.setItem(persistKey, JSON.stringify(searchList));
}

async function onSave() {
  if (!formRef) {
    return;
  }
  try {
    await formRef.validate();
  } catch (err) {
    return;
  }
  save(dialogModel);
  onCloseResolve({
    type: "ok",
  });
}

/** 点击关闭按钮 */
function onClose() {
  onCloseResolve({
    type: "cancel",
  });
}

async function beforeClose(done: (cancel: boolean) => void) {
  done(false);
  onCloseResolve({
    type: "cancel",
  });
}

defineExpose({
  showDialog,
  onRefresh,
});
</script>
