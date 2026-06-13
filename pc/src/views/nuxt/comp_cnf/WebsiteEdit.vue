<template>
<div
  un-flex="~ [1_0_0]"
  un-overflow="hidden"
>
  <KFrame
    ref="kFrameRef"
    :src="src"
  ></KFrame>
  
  <CompCnfDetail
    ref="compCnfDetailRef"
  ></CompCnfDetail>
</div>
</template>

<script lang="ts" setup>
import CompCnfDetail from "@/views/nuxt/comp_cnf/Detail.vue";

defineOptions({
  name: "网站编辑",
});

const usrStore = useUsrStore();

const kFrameRef = $(useTemplateRef("kFrameRef"));
const compCnfDetailRef = $(useTemplateRef("compCnfDetailRef"));

let host = location.origin + "/";
let src = $ref(host);

if (process.env.NODE_ENV === "development") {
  host = "http://localhost:3000/";
  src = host;
}

src += "?website_edit=1";
src += `&authorization=${ encodeURIComponent(usrStore.authorization) }`;

async function onMessage(event: MessageEvent) {
  const url = new URL(event.origin);
  if (url.hostname !== location.hostname) {
    return;
  }
  const data = event.data;
  const action = data?.action;
  const payload = data?.payload;
  if (action === "openCompCnfDetail") {
    if (!compCnfDetailRef) {
      return;
    }
    const id = payload?.id;
    const allow_types = payload?.allow_types as ("text" | "textarea" | "richtext" | "image")[] | undefined;
    
    const {
      type,
    } = await compCnfDetailRef.showDialog({
      title: "网站编辑",
      action: payload?.action === "edit" ? "edit" : "add",
      isWebsiteEdit: true,
      model: {
        ids: id ? [ id ] : undefined,
        allow_types,
        input: {
          lbl: payload?.lbl,
          group: payload?.group,
        },
      },
    });
    
    if (type === "cancel") {
      return;
    }
    
    const iframeRef = kFrameRef?.getRef() as HTMLIFrameElement | undefined;
    if (!iframeRef) {
      return;
    }
    // iframeRef.src = `${ host }?website_edit=1&authorization=${ encodeURIComponent(usrStore.authorization) }`;
    const contentWindow = iframeRef.contentWindow;
    if (!contentWindow) {
      return;
    }
    contentWindow.postMessage({
      action: "compCnfUpdated",
    }, "*");
  }
}

onMounted(() => {
  window.addEventListener("message", onMessage);
});

onUnmounted(() => {
  window.removeEventListener("message", onMessage);
});
</script>
