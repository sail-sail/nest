import {
  ElMessage,
  ElMessageBox,
} from "element-plus";

export const MessageBox = {
  success(msg: string) {
    if (!msg) return;
    msg = msg.trim();
    if (msg.length < 100) {
      ElMessage.success(msg);
    } else {
      ElMessageBox.alert(msg);
    }
  }
};
