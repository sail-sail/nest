<script setup lang="ts">
import { onLaunch } from "@dcloudio/uni-app";
import { uniqueID } from "@/utils/StringUtil";

onLaunch((async(options: any) => {
  const indexStore = useIndexStore();
  indexStore.setLaunchOptions(options);
  let _uid: string | undefined = undefined;
  try {
    _uid = (await uni.getStorage({
      key: "_uid"
    })).data;
  } catch (err) {
  }
  if (!_uid) {
    _uid = uniqueID();
    await uni.setStorage({
      key: "_uid",
      data: _uid
    });
  }
  indexStore.setUid(_uid);
}));
</script>
<style lang="scss">
/* #ifdef APP-NVUE */
@import "./tmui/scss/nvue.css";
/* #endif */
/* #ifndef APP-NVUE */
@import "./tmui/scss/noNvue.css";
/* #endif */

@import "./assets/style/common.scss";
</style>
