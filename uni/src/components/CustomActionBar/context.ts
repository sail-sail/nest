import type {
  InjectionKey,
  Ref,
} from "vue";

/** 操作按钮上报使用的插槽侧通道（仅渲染用，不计数） */
export type ActionBarCollector = Ref<Comment[]>;

export type ActionBarRegistry = {
  /** 当前上报中的业务按钮数量 */
  count: Ref<number>;
  register: () => void;
  unregister: () => void;
};

export const actionBarCollectorKey: InjectionKey<ActionBarCollector> = Symbol("CustomActionBarCollector");

export const actionBarRegistryKey: InjectionKey<ActionBarRegistry> = Symbol("CustomActionBarRegistry");
