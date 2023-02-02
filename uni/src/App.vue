<script setup lang="ts">
import { onLaunch } from "@dcloudio/uni-app";
import { uniqueID } from "@/utils/StringUtil";
import { uniLogin } from "@/utils/request";

import useIndexStore from "@/store/index";
import useUsrStore from "@/store/usr";

onLaunch((async(options: any) => {
  const indexStore = useIndexStore();
  const usrStore = useUsrStore();
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
  let authorization: string | undefined = undefined;
  try {
    authorization = (await uni.getStorage({
      key: "authorization"
    })).data;
  } catch (err) {
  }
  if (!authorization) {
    await uniLogin();
  } else {
    await usrStore.setAccessToken(authorization);
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
.uni-flex-card.uni-card, .uni-flex-card>.uni-card {
  display: flex;
  flex-direction: column;
  flex: 1 0 0;
  overflow: hidden;
  .uni-card__content {
    display: flex;
    flex-direction: column;
    flex: 1 0 0;
    overflow: hidden;
  }
}
</style>
