<template>
<view
  un-flex="~ [1_0_0] col"
  un-overflow="hidden"
  un-relative
>
  
  <scroll-view
    un-flex="~ [1_0_0] col"
    un-overflow="hidden"
    scroll-y
    enable-back-to-top
    enable-flex
  >
    
    <view
      un-m="x-2"
    >
      
      <tm-form
        ref="formRef"
        v-model="message_input"
        :label-width="160"
        :rules="form_rules"
        @submit="onSave"
      >
        
        <!-- 分类 -->
        <template
          v-if="props.hideFields?.includes('category') !== true"
        >
          <!-- 分类 -->
          <tm-form-item
            label="分类"
            name="category"
            :readonly="isReadonly"
          >
            <DictSelect
              v-model="message_input.category"
              v-model:model-label="message_input.category_lbl"
              placeholder="请选择 分类"
              code="message_category"
            ></DictSelect>
          </tm-form-item>
        </template>
        
        <!-- 发送通道 -->
        <template
          v-if="props.hideFields?.includes('channel') !== true"
        >
          <!-- 发送通道 -->
          <tm-form-item
            label="发送通道"
            name="channel"
            :readonly="isReadonly"
          >
            <DictSelect
              v-model="message_input.channel"
              v-model:model-label="message_input.channel_lbl"
              placeholder="请选择 发送通道"
              code="message_channel"
            ></DictSelect>
          </tm-form-item>
        </template>
        
        <!-- 标题 -->
        <template
          v-if="props.hideFields?.includes('title') !== true"
        >
          <!-- 标题 -->
          <tm-form-item
            label="标题"
            name="title"
            :readonly="isReadonly"
          >
            <CustomInput
              v-model="message_input.title"
              placeholder="请输入 标题"
            ></CustomInput>
          </tm-form-item>
        </template>
        
        <!-- 内容 -->
        <template
          v-if="props.hideFields?.includes('content') !== true"
        >
          <!-- 内容 -->
          <tm-form-item
            label="内容"
            name="content"
            :readonly="isReadonly"
            :required="false"
          >
            <CustomInput
              v-model="message_input.content"
              placeholder="请输入 内容"
            ></CustomInput>
          </tm-form-item>
        </template>
        
        <!-- 跳转路由 -->
        <template
          v-if="props.hideFields?.includes('route_path') !== true"
        >
          <!-- 跳转路由 -->
          <tm-form-item
            label="跳转路由"
            name="route_path"
            :readonly="isReadonly"
            :required="false"
          >
            <CustomInput
              v-model="message_input.route_path"
              placeholder="请输入 跳转路由"
            ></CustomInput>
          </tm-form-item>
        </template>
        
        <!-- 跳转参数 -->
        <template
          v-if="props.hideFields?.includes('route_query') !== true"
        >
          <!-- 跳转参数 -->
          <tm-form-item
            label="跳转参数"
            name="route_query"
            :readonly="isReadonly"
            :required="false"
          >
            <CustomInput
              v-model="message_input.route_query"
              placeholder="请输入 跳转参数"
            ></CustomInput>
          </tm-form-item>
        </template>
        
        <!-- 发送人 -->
        <template
          v-if="props.hideFields?.includes('sender_usr_id') !== true"
        >
          <tm-form-item
            label="发送人"
            name="sender_usr_id"
            :readonly="isReadonly"
          >
            <CustomSelectModal
              v-model="message_input.sender_usr_id"
              v-model:model-label="message_input.sender_usr_id_lbl"
              placeholder="请选择 发送人"
              :method="getListUsr"
            ></CustomSelectModal>
          </tm-form-item>
        </template>
        
        <!-- 系统消息 -->
        <template
          v-if="props.hideFields?.includes('is_sys_msg') !== true"
        >
          <!-- 系统消息 -->
          <tm-form-item
            label="系统消息"
            name="is_sys_msg"
            :readonly="isReadonly"
          >
            <DictSelect
              v-model="message_input.is_sys_msg"
              v-model:model-label="message_input.is_sys_msg_lbl"
              placeholder="请选择 系统消息"
              code="yes_no"
            ></DictSelect>
          </tm-form-item>
        </template>
        
        <!-- 置顶 -->
        <template
          v-if="props.hideFields?.includes('is_pinned') !== true"
        >
          <!-- 置顶 -->
          <tm-form-item
            label="置顶"
            name="is_pinned"
            :readonly="isReadonly"
          >
            <DictSelect
              v-model="message_input.is_pinned"
              v-model:model-label="message_input.is_pinned_lbl"
              placeholder="请选择 置顶"
              code="yes_no"
            ></DictSelect>
          </tm-form-item>
        </template>
        
        <!-- 所属组织 -->
        <template
          v-if="props.hideFields?.includes('org_id') !== true"
        >
          <tm-form-item
            label="所属组织"
            name="org_id"
            :readonly="isReadonly"
            :required="false"
          >
            <CustomSelectModal
              v-model="message_input.org_id"
              v-model:model-label="message_input.org_id_lbl"
              placeholder="请选择 所属组织"
              :method="getListOrg"
            ></CustomSelectModal>
          </tm-form-item>
        </template>
        
      </tm-form>
      
    </view>
    
    <view
      un-p="t-[300px]"
      un-box-border
    ></view>
    
  </scroll-view>
  
  <view
    v-if="dialogAction !== 'view' && hasOperationButtons"
    un-p="x-2 b-2"
    un-box-border
    un-flex="~"
    un-justify="center"
    un-items="center"
    un-gap="x-4"
  >
    
    <view
      v-if="props.hasCloseBtn"
      un-flex="~ [1_0_0]"
      un-overflow="hidden"
      un-justify="center"
      un-items="center"
    >
      <tm-button
        block
        color="info"
        @click="onCancel"
      >
        取消
      </tm-button>
    </view>
    
    <view
      un-flex="~ [1_0_0]"
      un-overflow="hidden"
      un-justify="center"
      un-items="center"
    >
      <tm-drawer
        v-model:show="operationDrawerShow"
        title="操作"
        un-w="full"
        :show-close="true"
        :show-footer="true"
        size="auto"
        :disable-teleport="props.drawerDisableTeleport"
      >
        
        <template #trigger>
          <tm-button
            block
            color="info"
            @click="operationDrawerShow = true"
          >
            <view
              un-flex="~"
              un-justify="center"
              un-items="center"
            >
              
              <view>
                操作
              </view>
              
              <view
                un-i="iconfont-caret_top"
              ></view>
              
            </view>
          </tm-button>
        </template>
        
        <template #footer>
          <tm-button
            block
            color="info"
            @click="operationDrawerShow = false;"
          >
            <view
              un-flex="~"
              un-justify="center"
              un-items="center"
              un-gap="x-1"
            >
              
              <view>
                关闭
              </view>
              
              <view
                un-i="iconfont-caret_bottom"
              ></view>
              
            </view>
          </tm-button>
        </template>
        
        <view
          un-p="4"
          un-box-border
          un-w="full"
          un-flex="~ col"
          un-gap="y-4"
        >
          
          <view
            v-if="dialogAction === 'edit'"
            un-flex="~"
            un-gap="x-2"
          >
            
            <tm-button
              v-if="permit('add', '新增') && message_id"
              block
              color="info"
              @click="operationDrawerShow = false; onCopy();"
            >
              复制
            </tm-button>
            
            <tm-button
              v-if="permit('edit', '编辑')"
              :disabled="!inited || is_form_hydrating || isReadonly"
              block
              @click="operationDrawerShow = false; formRef?.submit();"
            >
              保存
            </tm-button>
            
          </view>
          
          <CustomDivider
            v-if="dialogAction === 'edit'"
            :show-text="false"
            un-p="y-0 x-0"
          ></CustomDivider>
          
          <template
            v-if="dialogAction === 'copy' || dialogAction === 'add'"
          >
            
            <tm-button
              v-if="permit('add', '新增')"
              :disabled="!inited || is_form_hydrating"
              block
              @click="operationDrawerShow = false; formRef?.submit();"
            >
              保存
            </tm-button>
            
          </template>
            
          <CustomDivider
            v-if="dialogAction === 'copy' || dialogAction === 'add'"
            :show-text="false"
            un-p="y-0 x-0"
          ></CustomDivider>
          
        </view>
        
      </tm-drawer>
    </view>
    
  </view>
  
  <AppLoading></AppLoading>
  
</view>
</template>

<script setup lang="ts">
import {
  findOneMessage,
  createMessage,
  updateByIdMessage,
  getDefaultInputMessage,
  intoInputMessage,
  getPagePathMessage,
} from "./Api.ts";

import {
  getListUsr,
  getListOrg,
} from "./Api.ts";

import TmForm from "@/uni_modules/tm-ui/components/tm-form/tm-form.vue";

const pagePath = getPagePathMessage();
const permitStore = usePermitStore();

const {
  permit,
  permitAsync,
} = permitStore.getPermit(pagePath);

let inited = $ref(false);

let message_id = $ref<MessageId>();

let message_input = $ref<MessageInput>({ });
let message_model = $ref<MessageModel>();

const form_rules: Record<string, TM.FORM_RULE[]> = {
  category: [
    {
      required: true,
      message: "请选择 分类",
    },
  ],
  channel: [
    {
      required: true,
      message: "请选择 发送通道",
    },
  ],
  title: [
    {
      required: true,
      message: "请输入 标题",
    },
  ],
  sender_usr_id: [
    {
      required: true,
      message: "请选择 发送人",
    },
  ],
  is_sys_msg: [
    {
      required: true,
      message: "请选择 系统消息",
    },
  ],
  is_pinned: [
    {
      required: true,
      message: "请选择 置顶",
    },
  ],
};

type ActionType = "add" | "copy" | "edit" | "view";
let dialogAction = $ref<ActionType>("add");
let isReadonly = $ref(false);

watch(
  () => dialogAction,
  () => {
    if (dialogAction === "view") {
      isReadonly = true;
    }
  },
  {
    immediate: true,
  },
);

const formRef = $ref<InstanceType<typeof TmForm>>();
let is_form_hydrating = $ref(false);

let operationDrawerShow = $ref(false);

/** 是否有可用的操作按钮 */
const hasOperationButtons = $computed(() => {
  if (dialogAction === 'view') return false;

  if (dialogAction === 'edit') {
    // 复制按钮
    if (permit('add')) return true;
    // 编辑按钮
    if (permit('edit')) return true;
  }

  if (dialogAction === 'add' || dialogAction === 'copy') {
    // 新增按钮
    if (permit('add')) return true;
  }

  return false;
});

/** 复制 */
async function onCopy() {
  if (!message_id) {
    return;
  }
  if (!await permitAsync('add')) {
    uni.showToast({
      title: "无新增权限",
      icon: "none",
    });
    return;
  }
  uni.redirectTo({
    url: `/pages/message/Detail?message_id=${ encodeURIComponent(message_id) }&action=copy`,
  });
}

/** 保存 */
async function onSave(
  formSubmitResult?: TM.FORM_SUBMIT_RESULT,
) {
  if (dialogAction === "view") {
    return;
  }
  if (!inited || is_form_hydrating) {
    return;
  }
  if (dialogAction === "add" || dialogAction === "copy") {
    if (!await permitAsync('add')) {
      uni.showToast({
        title: "无新增权限",
        icon: "none",
      });
      return;
    }
  }
  if (dialogAction === "edit") {
    if (!await permitAsync('edit')) {
      uni.showToast({
        title: "无编辑权限",
        icon: "none",
      });
      return;
    }
  }
  if (formSubmitResult?.isPass === false) {
    const firstValid = formSubmitResult.firstValid;
    if (firstValid) {
      uni.showToast({
        title: firstValid.message,
        icon: "none",
      });
    }
    return;
  }
  
  if (props.beforeSave) {
    const canSave = await props.beforeSave(message_input);
    if (!canSave) {
      return;
    }
  }
  const currentAction = dialogAction;
  
  if (currentAction === "copy" || currentAction === "add") {
    const created_id = await createMessage(
      message_input,
    );
    await uni.showModal({
      content: "新增成功",
      showCancel: false,
    });
    if (backAfterSaveInner) {
      await uni.navigateBack();
    } else {
      message_id = created_id;
      dialogAction = "edit";
      await onRefresh();
    }
    uni.$emit("/pages/message/List:refresh", {
      action: currentAction,
    });
  } else if (currentAction === "edit") {
    if (!message_id) {
      uni.showToast({
        title: "编辑失败, id 不能为空",
        icon: "none",
      });
      return;
    }
    await updateByIdMessage(
      message_id,
      message_input,
    );
    await uni.showModal({
      content: "编辑成功",
      showCancel: false,
    });
    if (backAfterSaveInner) {
      await uni.navigateBack();
    } else {
      await onRefresh();
    }
    uni.$emit("/pages/message/List:refresh");
  }
  
}

/** 刷新 */
async function onRefresh() {
  is_form_hydrating = true;
  try {
    formRef?.resetValidation();
    if (dialogAction === "add") {
      message_input = await getDefaultInputMessage();
      message_input = {
        ...message_input,
        ...getMergedInputPatch(),
      };
    } else if (dialogAction === "copy") {
      if (!message_id) {
        uni.showToast({
          title: "复制失败, id 不能为空",
          icon: "none",
        });
        return;
      }
      const [
        defaultInput,
      ] = await Promise.all([
        getDefaultInputMessage(),
      ]);
      message_model = await findOneModel(
        {
          id: message_id,
          is_deleted: 0,
        },
        undefined,
        {
          notLoading: true,
        },
      );
      if (!message_model) {
        uni.showToast({
          title: "消息 已被删除",
          icon: "none",
        });
      }
      message_input = intoInputMessage(
        message_model,
      );
      message_input = {
        ...message_input,
        ...getMergedInputPatch(),
        id: undefined,
      };
    } else if (dialogAction === "edit" || dialogAction === "view") {
      message_model = await findOneModel(
        {
          id: message_id,
          is_deleted: 0,
        },
        undefined,
        {
          notLoading: true,
        },
      );
      if (!message_model) {
        uni.showToast({
          title: "消息 已被删除",
          icon: "none",
        });
      }
      message_input = intoInputMessage(
        message_model,
      );
    }
  } finally {
    await nextTick();
    is_form_hydrating = false;
  }
}

async function onCancel() {
  if (props.closeBtnFn) {
    await props.closeBtnFn();
  } else {
    await uni.navigateBack();
  }
}

async function initFrame() {
  await onRefresh();
  inited = true;
}

const props = withDefaults(
  defineProps<{
    /** 是否初始化页面, 默认为 true */
    init?: boolean;
    action?: ActionType;
    message_id?: MessageId;
    findOne?: typeof findOneMessage;
    beforeSave?: (input: MessageInput) => Promise<boolean>;
    inputPatch?: Partial<MessageInput>;
    backAfterSave?: boolean;
    hideFields?: string[];
    hasCloseBtn?: boolean;
    closeBtnFn?: () => Promise<void> | void;
    drawerDisableTeleport?: boolean;
  }>(),
  {
    init: true,
    action: undefined,
    message_id: undefined,
    findOne: undefined,
    beforeSave: undefined,
    inputPatch: undefined,
    backAfterSave: true,
    hideFields: undefined,
    hasCloseBtn: undefined,
    closeBtnFn: undefined,
    drawerDisableTeleport: undefined,
  },
);

let inputPatchByQuery = $ref<Partial<MessageInput>>({ });
let backAfterSaveInner = $ref(true);

function getMergedInputPatch(): Partial<MessageInput> {
  return {
    ...inputPatchByQuery,
    ...props.inputPatch,
  };
}

let findOneModel: typeof findOneMessage = findOneMessage;

watch(
  () => [
    props.action,
    props.message_id,
    props.findOne,
    props.backAfterSave,
  ],
  () => {
    if (props.action) {
      dialogAction = props.action;
    }
    if (props.message_id) {
      message_id = props.message_id;
    }
    if (props.findOne) {
      findOneModel = props.findOne;
    } else {
      findOneModel = findOneMessage;
    }
    backAfterSaveInner = props.backAfterSave ?? true;
  },
  {
    immediate: true,
  },
);

onLoad(async function(query?: AnyObject) {
  const message_id_str = query?.message_id;
  const action = props.action || query?.action;
  const input_patch = query?.input_patch;
  const back_after_save = query?.back_after_save;
  if (action === "add") {
    dialogAction = "add";
  } else if (action === "copy") {
    dialogAction = "copy";
  } else if (action === "edit") {
    dialogAction = "edit";
  }
  if (back_after_save != null) {
    backAfterSaveInner = decodeURIComponent(back_after_save) !== "0";
  }
  if (input_patch) {
    try {
      const data = JSON.parse(decodeURIComponent(input_patch));
      if (data && typeof data === "object") {
        inputPatchByQuery = data as Partial<MessageInput>;
      }
    } catch (err) {
      console.error(err);
    }
  }
  if (message_id_str) {
    message_id = decodeURIComponent(message_id_str) as MessageId | undefined;
    if (!action) {
      dialogAction = "edit";
    }
  }
  await initFrame();
});

async function initOrRefresh() {
  if (!inited) {
    await initFrame();
  } else {
    await onRefresh();
  }
}

defineExpose({
  refresh: initOrRefresh,
});
</script>
