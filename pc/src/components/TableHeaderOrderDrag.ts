import { DirectiveBinding } from "vue";

function dragoverFn(event: DragEvent) {
  event.preventDefault();
}

export function headerOrderDrag(el: HTMLElement, binding: DirectiveBinding) {
  const bindVal: Function = binding.value;
  if (!bindVal) {
    console.error("请设置正确的 v-header-order-drag 参数值!", el, binding.value);
    return;
  }
  const headTr = el.querySelector(".el-table__header-wrapper>.el-table__header thead tr");
  const ths = headTr.querySelectorAll(".el-table__cell");
  for (let i = 0; i < ths.length; i++) {
    if (i < (bindVal().offset || 0)) continue;
    const th = <HTMLTableColElement> ths[i];
    th.draggable = true;
    if (!(<any>th).__hasDragEvent) {
      (<any>th).__hasDragEvent = true;
      th.addEventListener("dragstart", function(event: DragEvent) {
        let targetEl = <HTMLElement> event.target;
        for (let k = 0; k < 3; k++) {
          if (targetEl.nodeName === "TH") {
            break;
          }
          targetEl = targetEl.parentElement;
        }
        if (targetEl.nodeName !== "TH") return;
        const ths = headTr.querySelectorAll(".el-table__cell");
        const targetIndex = Array.prototype.indexOf.call(ths, targetEl);
        const prop = bindVal().tableColumns.filter((column: any) => column.hide !== true)[targetIndex - (bindVal().offset || 0)].prop;
        event.dataTransfer.setData("prop", prop);
      });
      th.addEventListener("dragover", dragoverFn);
      th.addEventListener("drop", function(event: DragEvent) {
        event.preventDefault();
        const srcProp = event.dataTransfer.getData("prop");
        if (!srcProp) return;
        let targetEl = <HTMLElement> event.target;
        for (let k = 0; k < 3; k++) {
          if (targetEl.nodeName === "TH") {
            break;
          }
          targetEl = targetEl.parentElement;
        }
        if (targetEl.nodeName !== "TH") return;
        const ths = headTr.querySelectorAll(".el-table__cell");
        let targetIndex = Array.prototype.indexOf.call(ths, targetEl);
        if (targetIndex === -1) return;
        const hiddenColumnsDivArr = el.querySelectorAll(".el-table__inner-wrapper>.hidden-columns>div");
        const hiddenColumnsDiv = <any> hiddenColumnsDivArr[targetIndex];
        if (!hiddenColumnsDiv) return;
        const prop = hiddenColumnsDiv.__vnode?.el?.__vueParentComponent?.columnConfig?._value?.property;
        if (!prop) return;
        targetIndex = bindVal().tableColumns.findIndex((column: any) => column.prop === prop);
        const target0Idx = bindVal().tableColumns.findIndex((column: any) => column.prop === srcProp);
        if (target0Idx === -1) return;
        if (targetIndex === target0Idx) return;
        bindVal().tableColumns.splice(targetIndex, 0, bindVal().tableColumns.splice(target0Idx, 1)[0]);
        if (bindVal().storeColumns) {
          bindVal().storeColumns(bindVal().tableColumns);
        }
      });
    }
  }
}
