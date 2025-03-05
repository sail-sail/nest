<template>
<CustomDialog
  ref="customDialogRef"
  :before-close="beforeClose"
  @keydown.arrow-down.prevent.stop="onArrowDown"
  @keydown.arrow-up.prevent.stop="onArrowUp"
  @keydown.arrow-left.prevent.stop="onArrowLeft"
  @keydown.arrow-right.prevent.stop="onArrowRight"
  @keydown.ctrl.f.prevent.stop="onCtrlF"
  @keydown.enter="onEnter"
  @keydown.ctrl.i.prevent.stop="openAddSvg"
>
  <div
    ref="wrapDivRef"
    un-flex="~ [1_0_0] col basis-[inherit]"
    un-overflow-hidden
  >
    <div
      un-flex="~ [1_0_0] col basis-[inherit]"
    >
      <div
        un-w="full"
        un-flex="~"
        un-justify-center
        un-items-center
        un-p="b-2"
        un-box-border
      >
        <div
          un-w="100"
        >
          <CustomInput
            ref="searchRef"
            v-model="searchStr"
            :prefix-icon="SearchIcon"
            align="center"
            @keydown.enter="onSearchEnter"
            @keydown.esc="onSearchEsc"
            @keydown.arrow-down.stop
            @keydown.arrow-up.stop
            @keydown.arrow-left.stop
            @keydown.arrow-right.stop
          ></CustomInput>
        </div>
        <div
          un-flex="~"
          un-justify-center
          un-items-center
          un-h="full"
          un-aspect="square"
          un-cursor-pointer
          un-b="1 solid transparent hover:[var(--el-border-color)]"
          un-rounded
          un-box-border
          un-m="l-1"
          @click="onRevert"
        >
          <div
            un-text="5"
            un-i="iconfont-undo"
          ></div>
        </div>
      </div>
      
      <div
        un-flex="~ [1_0_0] col basis-[inherit]"
        un-overflow="auto"
        un-p="x-6 t-2 b-4"
        un-box-border
      >
        
        <div
          un-w="full"
          un-grid="~ cols-[repeat(6,minmax(0,1fr))]"
          un-gap="x-2 y-4"
          un-justify-items-center
          un-items-center
          un-box-border
        >
          
          <div
            v-for="icon_model in icon_models_filtered"
            :id="icon_model.img"
            :key="icon_model.img"
            un-flex="~"
            un-items-center
            un-w="full"
            un-h="full"
            un-p="2"
            un-box-border
          >
            
            <div
              v-if="icon_model._type === 'add'"
              un-flex="~"
              un-items-center
              un-w="full"
              un-h="full"
              un-box-border
            >
              <div
                un-b="1 dashed [var(--el-border-color)] hover:[var(--el-color-primary)]"
                un-rounded
                un-flex="~ col"
                un-items-center
                un-justify-center
                un-p="4"
                un-box-border
                un-w="full"
                un-h="full"
                un-cursor-pointer
                un-text="[var(--el-border-color)] hover:[var(--el-color-primary)]"
                :class="{
                  'custom_icon_selected': icon_model.img === selectedId,
                }"
                @click="openAddSvg"
              >
                <ElIconPlus
                  un-w="16"
                  un-h="16"
                />
              </div>
            </div>
            
            <div
              v-else
              un-b="1 solid [var(--el-border-color)] hover:[var(--el-color-primary)]"
              un-rounded
              un-flex="~ col"
              un-items-center
              un-justify-center
              un-p="4"
              un-box-border
              un-w="full"
              un-h="full"
              :class="{
                'custom_icon_selected': icon_model.img === selectedId,
              }"
              un-cursor-pointer
              @click="onSelectIcon(icon_model)"
              @dblclick="onEnter"
            >
              
              <div
                v-if="icon_model.img_lbl_svg && icon_model.img_lbl_svg.startsWith('data:image/svg+xml;')"
                :style="{
                  'mask-image': `url(${ icon_model.img_lbl_svg })`,
                  '-webkit-mask-image': `url(${ icon_model.img_lbl_svg })`,
                }"
                class="iconfont"
                un-h="16"
                un-w="16"
                un-aspect="square"
              ></div>
              
              <div
                v-else
                un-flex="~ col"
                un-items-center
                un-justify-center
                un-w="full"
              >
                <img
                  :src="icon_model.img_lbl_svg"
                  un-h="full"
                  un-w="full"
                  un-aspect="square"
                  un-rounded="sm"
                >
              </div>
              
              <div
                v-if="icon_model.code && icon_model.lbl"
                un-text="sm center"
                un-flex="~ col"
                un-items-center
                un-justify-center
              >
                <div
                  v-if="icon_model.code"
                >
                  {{ icon_model.code }}
                </div>
                <div
                  v-if="icon_model.lbl"
                >
                  {{ icon_model.lbl }}
                </div>
              </div>
              
            </div>
            
          </div>
        </div>
        
      </div>
    </div>
    <div
      un-p="y-3"
      un-box-border
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
        <span>
          {{ ns("关闭") }}
        </span>
      </el-button>
      
      <el-button
        plain
        type="primary"
        @click="onEnter"
      >
        <template #icon>
          <ElIconCircleCheck />
        </template>
        <span>
          {{ ns("确定") }}
        </span>
      </el-button>
      
    </div>
  </div>
  
  <input
    ref="svgInputRef"
    type="file"
    style="display: none"
    accept="image/svg+xml,image/png,image/jpeg,image/webp"
    @change="onSvgChange"
  >
  
</CustomDialog>
</template>

<script setup lang="ts">
import {
  checkImageMaxSize,
} from "@/utils/image_util";

import {
  findAll as findAllIcon,
} from "@/views/base/icon/Api.ts";

import {
  Search as SearchIcon,
} from "@element-plus/icons-vue";

const {
  ns,
  nsAsync,
  initSysI18ns,
} = useI18n();

const customDialogRef = $(useTemplateRef<InstanceType<typeof CustomDialog>>("customDialogRef"));

let inited = $ref(false);
let dialogTitle = $ref("");
let oldDialogTitle = "";
let oldDialogNotice: string | undefined = undefined;
let dialogNotice = $ref("");

const icon_models_str = localStorage.getItem("icon_models");
let icon_models = $ref<IconModel[]>(icon_models_str ? JSON.parse(icon_models_str) : [ ]);

let searchStr = $ref("");

const icon_models_filtered = $computed<IconModel[]>(() => {
  let icon_models2: IconModel[];
  if (!searchStr) {
    icon_models2 = [ ...icon_models ];
    if (selectedLbl && !icon_models2.some((item) => item.img_lbl_svg === selectedLbl)) {
      icon_models2.unshift({
        id: oldSelectedId as unknown as IconId,
        img: oldSelectedId as unknown as IconId,
        code: "",
        lbl: "",
        img_lbl_svg: selectedLbl,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any);
    }
  } else {
    icon_models2 = icon_models.filter((item) => {
      return item.lbl.includes(searchStr) || item.code.includes(searchStr);
    });
  }
  icon_models2.unshift({
    _type: "add",
    id: "" as unknown as IconId,
    img: "add",
    code: "",
    lbl: "",
    img_lbl_svg: "",
  } as unknown as IconModel);
  return icon_models2;
});

const wrapDivRef = $(useTemplateRef<InstanceType<typeof HTMLInputElement>>("wrapDivRef"));
const searchRef = $(useTemplateRef<InstanceType<typeof HTMLInputElement>>("searchRef"));

function onSearchEnter(e: MouseEvent) {
  e.stopImmediatePropagation();
  searchRef?.blur();
  (wrapDivRef?.closest(".el-dialog") as HTMLDivElement)?.focus();
}

function onSearchEsc(e: MouseEvent) {
  e.stopImmediatePropagation();
  searchRef?.blur();
  (wrapDivRef?.closest(".el-dialog") as HTMLDivElement)?.focus();
}

let oldSelectedId = $ref<string>();
let selectedId = $ref<string>();
let selectedLbl = $ref<string>();

type OnCloseResolveType = {
  type: "ok" | "cancel";
  changedId?: string;
  changedIdLbl?: string;
};

let onCloseResolve = function(_value: OnCloseResolveType) { };

/** 打开对话框 */
async function showDialog(
  arg?: {
    title?: string;
    notice?: string;
    model?: {
      id?: string | null;
      lbl?: string | null;
      compress?: boolean;
      maxImageWidth?: number;
      maxImageHeight?: number;
    };
  },
): Promise<OnCloseResolveType> {
  inited = false;
  dialogTitle = arg?.title ?? await nsAsync("选择图标");
  oldDialogTitle = dialogTitle;
  const notice = arg?.notice;
  oldDialogNotice = notice;
  dialogNotice = notice ?? "";
  const dialogRes = customDialogRef!.showDialog<OnCloseResolveType>({
    type: "default",
    title: $$(dialogTitle),
    pointerPierce: true,
    notice: $$(dialogNotice),
  });
  onCloseResolve = dialogRes.onCloseResolve;
  const model = arg?.model;
  selectedId = model?.id ?? undefined;
  selectedLbl = model?.lbl ?? undefined;
  
  if (model?.compress !== undefined) {
    compress = model.compress;
  }
  if (model?.maxImageWidth !== undefined) {
    maxImageWidth = model.maxImageWidth;
  }
  if (model?.maxImageHeight !== undefined) {
    maxImageHeight = model.maxImageHeight;
  }
  
  if (!selectedId && selectedLbl) {
    const icon_model = icon_models.find((item) => item.img_lbl_svg === selectedLbl);
    if (icon_model) {
      selectedId = icon_model.img;
    }
  }
  
  oldSelectedId = selectedId;
  
  searchStr = "";
  
  inited = true;
  
  nextTick(() => {
    onScrollIntoViewIfNeeded();
  });
  
  return await dialogRes.dialogPrm;
}

function onRevert() {
  searchStr = "";
  selectedId = oldSelectedId;
}

async function onRefresh() {
  icon_models = await findAllIcon(
    {
      is_enabled: [ 1 ],
    },
    undefined,
    undefined,
    {
      notLoading: true,
    },
  );
  if (!selectedId && selectedLbl) {
    const icon_model = icon_models.find((item) => item.img_lbl_svg === selectedLbl);
    if (icon_model) {
      selectedId = icon_model.img;
    }
  }
  oldSelectedId = selectedId;
  localStorage.setItem("icon_models", JSON.stringify(icon_models));
  
  nextTick(() => {
    onScrollIntoViewIfNeeded();
  });
}

function onSelectIcon(icon_model: IconModel) {
  selectedId = icon_model.img;
}

const svgInputRef = $(useTemplateRef<HTMLInputElement>("svgInputRef"));

function openAddSvg() {
  selectedId = "add";
  if (!svgInputRef) {
    return;
  }
  svgInputRef.click();
}

const textEncoder = new TextEncoder();

function arrayBufferToBase64(buffer: ArrayBuffer) {
  let binary = "";
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

let compress = true;
let maxImageWidth = 1920;
let maxImageHeight = 1080;

async function onSvgChange(e: Event) {
  const target = e.target as HTMLInputElement;
  if (!target.files) {
    return;
  }
  let file = target.files[0];
  if (!file) {
    return;
  }
  const type = file.type;
  if (
    type.startsWith("image/png") ||
    type.startsWith("image/jpeg") ||
    type.startsWith("image/webp")
  ) {
    file = await checkImageMaxSize(
      file,
      {
        compress,
        maxImageWidth,
        maxImageHeight,
      },
    );
  }
  const reader = new FileReader();
  reader.onload = async function(e) {
    const result = e.target?.result;
    if (!result) {
      return;
    }
    let changedId: string | undefined;
    let img_lbl_svg = result as string;
    if (img_lbl_svg.startsWith("data:image/svg+xml;base64,")) {
      const img_lbl_svg_base64 = img_lbl_svg.replace("data:image/svg+xml;base64,", "");
      img_lbl_svg = `data:image/svg+xml;utf8,${ encodeURIComponent(atob(img_lbl_svg_base64)) }`;
      const buffer = await crypto.subtle.digest("SHA-256", textEncoder.encode(img_lbl_svg));
      changedId = arrayBufferToBase64(buffer).substring(0, 22);
    }
    onCloseResolve({
      type: "ok",
      changedId,
      changedIdLbl: img_lbl_svg,
    });
  };
  reader.readAsDataURL(file);
}

function onArrowDown() {
  if (!selectedId) {
    selectedId = icon_models_filtered?.[0]?.img;
  }
  if (!selectedId) {
    return;
  }
  let index = icon_models_filtered.findIndex((item) => item.img === selectedId);
  if (index === -1) {
    selectedId = icon_models_filtered?.[0]?.img;
    index = 0;
    return;
  }
  if (index + 6 < icon_models_filtered.length) {
    selectedId = icon_models_filtered[index + 6].img;
  } else {
    selectedId = icon_models_filtered[index % 6].img;
  }
  onScrollIntoViewIfNeeded();
}

function onScrollIntoViewIfNeeded() {
  if (!selectedId) {
    return;
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ele = document.getElementById(selectedId) as any;
  if (ele) {
    if (ele.scrollIntoViewIfNeeded) {
      ele.scrollIntoViewIfNeeded();
    } else {
      ele.scrollIntoView();
    }
  }
}

function onArrowUp() {
  if (!selectedId) {
    selectedId = icon_models_filtered?.[0]?.img;
  }
  if (!selectedId) {
    return;
  }
  let index = icon_models_filtered.findIndex((item) => item.img === selectedId);
  if (index === -1) {
    selectedId = icon_models_filtered?.[0]?.img;
    index = 0;
    return;
  }
  if (index - 6 >= 0) {
    selectedId = icon_models_filtered[index - 6].img;
  } else if (Math.floor(icon_models_filtered.length / 6) * 6 + index % 6 < icon_models_filtered.length) {
    selectedId = icon_models_filtered[Math.floor(icon_models_filtered.length / 6) * 6 + index % 6].img;
  } else if (Math.floor(icon_models_filtered.length / 6) * 6 + index % 6 - 6 > 0) {
    selectedId = icon_models_filtered[Math.floor(icon_models_filtered.length / 6) * 6 + index % 6 - 6].img;
  }
  onScrollIntoViewIfNeeded();
}

function onArrowLeft() {
  if (!selectedId) {
    selectedId = icon_models_filtered?.[0]?.img;
  }
  if (!selectedId) {
    return;
  }
  let index = icon_models_filtered.findIndex((item) => item.img === selectedId);
  if (index === -1) {
    selectedId = icon_models_filtered?.[0]?.img;
    index = 0;
    return;
  }
  if (index - 1 >= 0) {
    selectedId = icon_models_filtered[index - 1].img;
  } else {
    selectedId = icon_models_filtered[icon_models_filtered.length - 1].img;
  }
  onScrollIntoViewIfNeeded();
}

function onArrowRight() {
  if (!selectedId) {
    selectedId = icon_models_filtered?.[0]?.img;
  }
  if (!selectedId) {
    return;
  }
  let index = icon_models_filtered.findIndex((item) => item.img === selectedId);
  if (index === -1) {
    selectedId = icon_models_filtered?.[0]?.img;
    index = 0;
    return;
  }
  if (index + 1 < icon_models_filtered.length) {
    selectedId = icon_models_filtered[index + 1].img;
  } else {
    selectedId = icon_models_filtered[0].img;
  }
  onScrollIntoViewIfNeeded();
}

function onCtrlF() {
  searchRef?.focus();
}

function onEnter() {
  if (selectedId === "add") {
    openAddSvg();
    return;
  }
  if (selectedId === oldSelectedId) {
    onClose();
    return;
  }
  const icon_model = icon_models.find((item) => item.img === selectedId);
  onCloseResolve({
    type: "ok",
    changedId: selectedId,
    changedIdLbl: icon_model?.img_lbl_svg,
  });
}

function onClose() {
  onCloseResolve({
    type: "cancel",
  });
}

async function beforeClose(done: (cancel: boolean) => void) {
  done(false);
  onCloseResolve({
    type: "cancel",
    changedId: selectedId,
    changedIdLbl: selectedLbl,
  });
}

async function initFrame() {
  await onRefresh();
  await initSysI18ns([
    "关闭",
    "确定",
    "选择图标",
  ]);
  inited = true;
}

initFrame();

defineExpose({
  showDialog,
  refresh: onRefresh,
});
</script>

<style scoped lang="scss">
.iconfont {
  // -webkit-mask: var(--un-icon) no-repeat;
  // mask-image: var(--un-icon) no-repeat;
  -webkit-mask-size: 100% 100%;
  mask-repeat: no-repeat;
  mask-size: 100% 100%;
  background-color: currentColor;
  color: inherit;
  width: 100%;
  height: 100%;
}
.custom_icon_selected {
  border-color: var(--el-color-primary);
  color: var(--el-color-primary);
}
</style>
