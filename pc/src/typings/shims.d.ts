import type { AttributifyAttributes } from "@unocss/preset-attributify";

type AttributifyAttributes2 = AttributifyAttributes & {
  overflowHidden?: boolean;
  overflowAuto?: boolean;
  justifyEnd?: boolean;
  placeContentCenter?: boolean;
  selfStart?: boolean;
  boxBorder?: boolean;
  justifyStart?: boolean;
  itemsCenter?: boolean;
  itemsEnd?: boolean;
  justifyCenter?: boolean;
  selfCenter?: boolean;
  cursorPointer?: boolean;
  absolute?: boolean;
  posAbsolute?: boolean;
  right2?: boolean;
  textGray?: boolean;
  whitespaceNowrap?: boolean;
  posRelative?: boolean;
  selfSenter?: boolean;
  i?: string;
  autoComplete?: "off" | "on";
  overflowYAuto?: boolean;
  overflowXAuto?: boolean;
  overflowXHidden?: boolean;
  overflowYHidden?: boolean;
  top?: string;
  left?: string;
  right?: string;
  bottom?: string;
  title?: string;
  border1px?: boolean;
  borderTransparent?: boolean;
  displayNone?: boolean;
  bottom0?: boolean;
  borderRounded?: boolean;
  easeIn?: boolean;
  textRight?: boolean;
  justifyItemsEnd?: boolean;
  set?: any;
}

declare module '@vue/runtime-dom' {
  interface HTMLAttributes extends AttributifyAttributes2 { }
}

declare module 'vue' {
  interface ComponentCustomProps extends AttributifyAttributes2 { }
  interface CSSProperties {
    [key: `--${string}`]: string
  }
}
