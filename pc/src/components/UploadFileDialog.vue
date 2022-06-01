<template>
<el-dialog
  draggable
  :fullscreen="fullscreen"
  v-model="dialogVisible"
  append-to-body
  :close-on-click-modal="false"
  custom-class="custom_dialog auto_dialog UploadFileDialog"
  top="0"
  :before-close="beforeClose"
>
  <template #header>
    <div class="dialog_title" v-draggable>
      <div class="title_lbl">
        <span class="dialogTitle_span">{{ dialogTitle || " " }}</span>
      </div>
      <el-icon class="full_but" @click="setFullscreen">
        <FullScreen/>
      </el-icon>
    </div>
  </template>
  <div class="wrap_div">
    <div class="content_div">
      <div class="dialog_form2">
        
        <label class="form_label">
          <span style="color: red;">*</span>
          <span>文件</span>
        </label>
        <div class="form_input">
          <div
            class="upload_div"
            @click="fileRef?.click()"
          >
            <template v-if="fileInfo.name">
              <span style="font-size: 16px;">
                {{ fileInfo.name }}
              </span>
            </template>
            <template v-else>
              <el-icon :size="33">
                <Plus />
              </el-icon>
            </template>
          </div>
        </div>
        
        <template v-if="false">
          <label class="form_label">
            <span>模板下载</span>
          </label>
          <div class="form_input">
            <el-button
              type="primary"
              plain
            >
              导入模板下载
            </el-button>
          </div>
        </template>
        
      </div>
    </div>
    <div class="toolbox_div">
      <el-button
        :icon="CircleClose"
        @click="cancelClk"
      >
        取消
      </el-button>
      <el-button
        :icon="CircleCheck"
        type="primary"
        @click="confirmClk"
        :disabled="!fileInfo.name"
      >
        确定导入
      </el-button>
    </div>
  </div>
  <input
    type="file"
    @change="inputChg"
    style="display: none;"
    ref="fileRef"
  />
</el-dialog>
</template>

<script setup lang="ts">
import { nextTick } from "vue";
import {
  ElDialog,
  ElMessage,
  ElMessageBox,
  ElImage,
  ElIcon,
  ElButton,
} from "element-plus";
import {
  FullScreen,
  Plus,
  CircleCheck,
  CircleClose,
} from "@element-plus/icons-vue";
import { useFullscreenEffect } from "@/compositions/fullscreen";

let { fullscreen, setFullscreen } = $(useFullscreenEffect());

let dialogTitle = $ref("导入");
let dialogVisible = $ref(false);

let fileRef = $ref<HTMLInputElement>();

let fileObj: File;
let fileInfo = $ref({
  name: "",
  size: 0,
});

let onCloseResolve = function(value?: File) { };

async function showDialog(arg?: { title?: string }) {
  if (arg) {
    dialogTitle = arg.title;
  }
  fileInfo = {
    name: "",
    size: 0,
  };
  dialogVisible = true;
  if (fileRef) {
    fileRef.value = "";
    fileRef.click();
  } else {
    nextTick(() => {
      console.log(fileRef);
      if (fileRef) {
        fileRef.value = "";
        fileRef.click();
      }
    });
  }
  const reslut = await new Promise<File>((resolve) => {
    onCloseResolve = resolve;
  });
  return reslut;
}

async function inputChg() {
  if (!fileRef) return;
  const file = fileRef.files[0];
  fileRef.value = "";
  fileInfo.name = file.name;
  fileInfo.size = file.size;
  fileObj = file;
}

async function confirmClk() {
  if (!fileObj) return;
  dialogVisible = false;
  onCloseResolve(fileObj);
}

async function cancelClk() {
  if (fileObj) {
    try {
      await ElMessageBox.confirm(`文件 ${ fileInfo.name } 尚未导入, 取消导入? `, {
        confirmButtonText: "取消导入",
        cancelButtonText: "我再想想",
        type: "warning",
      });
    } catch (err) {
    }
  }
  dialogVisible = false;
  onCloseResolve();
}

async function beforeClose(done: (cancel: boolean) => void) {
  if (fileObj && fileInfo.name) {
    try {
      await ElMessageBox.confirm(`文件 ${ fileInfo.name } 尚未导入, 取消导入? `, {
        confirmButtonText: "取消导入",
        cancelButtonText: "我再想想",
        type: "warning",
      });
    } catch (err) {
      return;
    }
  }
  done(false);
  onCloseResolve();
}
defineExpose({ showDialog });
</script>

<style lang="scss" scoped>
.wrap_div {
  flex: 1 0 0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  flex-basis: inherit;
}
.content_div {
  flex: 1 0 0;
  overflow: auto;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-direction: column;
  padding: 40px;
  flex-basis: inherit;
}
.toolbox_div {
  padding-top: 10px;
  padding-bottom: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.dialog_form2 {
  display: grid;
  grid-template-columns: repeat(1, minmax(min-content, max-content) 330px);
  justify-items: end;
  align-items: center;
  grid-row-gap: 15px;
  grid-column-gap: 5px;
  grid-template-rows: auto;
  place-content: center;
}
.form_label {
  margin-left: 3px;
  text-align: right;
}
.form_label::after {
  content: ":";
}
.form_input {
  width: 100%;
  justify-self: start;
}
.upload_div {
  width: 100%;
  height: 220px;
  border-style: dashed;
  border-radius: 6px;
  border-color: #ccc;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px;
  box-sizing: border-box;
  overflow: auto;
}
</style>
