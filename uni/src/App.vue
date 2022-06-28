<script setup lang="ts">
import { onLaunch } from "@dcloudio/uni-app";
import { uniqueID } from "@/utils/util";
import { uniLogin } from "@/utils/request";

import useIndexStore from "@/store/index";
import useUsrStore from "@/store/usr";

onLaunch(<any>(async(options: any) => {
  const indexStore = useIndexStore();
  const usrStore = useUsrStore();
  indexStore.setLaunchOptions(options);
  let _uid: string|undefined = undefined;
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
  let access_token: string|undefined = undefined;
  try {
    access_token = (await uni.getStorage({
      key: "access_token"
    })).data;
  } catch (err) {
  }
  if (!access_token) {
    await uniLogin();
  } else {
    await usrStore.setAccessToken(access_token);
  }
}));
</script>
<style lang="scss">
@import "@/uni_modules/uni-scss/index.scss";
page {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  font-size: 14px;
}
</style>
