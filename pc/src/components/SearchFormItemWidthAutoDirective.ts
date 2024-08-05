import type {
  DirectiveBinding,
} from "vue";

export function searchFormItemWidthAuto(el: HTMLElement, binding: DirectiveBinding) {
  const inited = binding.value as boolean;
  if (!inited) {
    return;
  }
  const formEl = el as HTMLFormElement | null;
  if (!formEl) {
    return;
  }
  const formItemEl = formEl.querySelector(".el-form-item") as HTMLDivElement | null;
  const formItemContentEl = formItemEl?.querySelector(".el-form-item__content") as HTMLDivElement | null;
  if (!formItemEl || !formItemContentEl) {
    return;
  }
  const formItemContentWidth = formItemContentEl.offsetWidth;
  if (formItemContentWidth >= 224) {
    return;
  }
  const labelWrapEl = formItemEl.querySelector(".el-form-item__label-wrap") as HTMLDivElement | null;
  if (!labelWrapEl) {
    return;
  }
  const labelWidth = labelWrapEl.offsetWidth;
  const labelMarginLeft = parseInt(labelWrapEl.style.marginLeft);
  formEl.style.gridTemplateColumns = `repeat(auto-fill, ${ labelWidth + labelMarginLeft + 224 }px)`;
};
