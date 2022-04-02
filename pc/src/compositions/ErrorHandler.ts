import { ComponentPublicInstance } from "vue";

export function errorHandler(err: Error, vm: ComponentPublicInstance | null, info: string) {
  if (
    err &&
    err.message &&
    (
      err.message.includes("Failed to fetch dynamically imported module") ||
      err.message.includes("Unable to preload CSS for")
    )
  ) {
    if (window.confirm("发现新版本, 是否立即重新载入?")) {
      let pathname = window.location.pathname;
      const params = new URLSearchParams(window.location.search);
      params.set("__reload__", "");
      const searchStr = "?" + params.toString();
      const hash = window.location.hash || "";
      window.sessionStorage.setItem("__hash__", hash);
      window.location.href = window.location.origin + pathname + searchStr + hash;
      return;
    }
  }
  console.error(err, vm, info);
}
