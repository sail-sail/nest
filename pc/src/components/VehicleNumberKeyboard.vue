<!--
 * 车牌号 键盘
 * @author: jinweibin
 * @since: 2023-07-08
 * CarNumberKeyboard.vue
-->
<template>
  <div class="vehicle-number-keyboard">
    <div class="keyboard">
      <div 
      class="line"
      v-for="(line, index) in keySet"
      :key="index">
        <span
          v-for="(key, index) in line"
          :key="index"
          :class="getClassesOfKey(key)"
          v-text="getCaptionOfKey(key)"
          @click="e => clickKey(e, key)" 
          @mousedown="mousedown" 
          :style="getKeyStyle(key)"></span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {Layouts} from "./VehicleNumberLayout";

const props =
  defineProps<{
    input?: HTMLInputElement,
    layout: String | Object,
    defaultKeyset?: String,
    accept: Function,
    cancel: Function,
    change: Function,
    next: Function,
    options?: Object,
  }>();

const emits = defineEmits(['change']);

const currentKeySet = ref(props.defaultKeyset);

const keySet = computed(() => {
  let layout = getLayout();
  if (!layout) return;

  let keySet = layout[currentKeySet.value as string];
  if (!keySet) return;

  let res: any[] = [];

  let meta = layout["_meta"] || {};

  keySet.forEach((line: string) => {
    let row: any[] = [];
    line.split(" ").forEach((item) => {
      if (typeof item == "object") {
        row.push(item);
      }
      else if (typeof item == "string") {
        if (item.length > 2 && item[0] == "{" && item[item.length - 1] == "}") {
          let name = item.substring(1, item.length - 1);
          if (meta[name])
            row.push(meta[name]);
          else
            console.warn("Missing named key from meta: " + name);
        } else {
          if (item == "") {
            // Placeholder
            row.push({
              placeholder: true
            });

          } else {
            // Normal key
            row.push({
              key: item,
              text: item
            });
          }
        }
      }
    });
    res.push(row);
  });

  return res;
});

const inputScrollLeft = ref(0);

const modelValue = computed({
  get: () => props.input,
  set: (value) => { }
});


const getLayout = () => {
  if (typeof props.layout == "string")
    return Layouts[props.layout];
  return props.layout;
};

const changeKeySet = (name: string) => {
  let layout = getLayout();
  if (layout[name] != null)
    currentKeySet.value = name;
};

const toggleKeySet = (name: string) => {
  currentKeySet.value = currentKeySet.value == name ? "default" : name;
};

const getCaptionOfKey = (key: { text: string; key: string; }) => {
  return key.text || key.key || "";
};

const getClassesOfKey = (key: { placeholder: string; keySet: string; func: string; classes: string; }) => {
  if (key.placeholder)
    return "placeholder";
  else {
    let classes = "key " + (key.func || "") + " " + (key.classes || "");
    if (key.keySet && currentKeySet.value == key.keySet)
      classes += " activated";

    return classes;
  }
};

const getKeyStyle = (key: { width: number; }) => {
  if (key.width)
    return {
      flex: key.width
    };
};

const supportsSelection = () => {
  return (/text|password|search|tel|url/).test(props.input?.type as string);
};

const getCaret = () => {
  if (supportsSelection()) {
    let pos = {
      start: props.input?.selectionStart || 0,
      end: props.input?.selectionEnd || 0
    };

    if (pos.end < pos.start)
      pos.end = pos.start;

    return pos;

  } else {
    let val = props.input?.value as string;
    return {
      start: val.length,
      end: val.length
    };
  }
};

const backspace = (caret: { start: number; end: number; }, text: string) => {
  if (caret.start < caret.end) {
    text = text.substring(0, caret.start) + text.substring(caret.end);
  } else {
    text = text.substring(0, caret.start - 1) + text.substring(caret.start);
    caret.start -= 1;
  }
  caret.end = caret.start;
  return text;
};

const insertChar = (caret: { start: number; end: number; }, text: string, ch: any) => {
  if (caret.start < caret.end) {
    text = text.substring(0, caret.start) + ch.toString() + text.substring(caret.end);
  } else {
    text = text.substr(0, caret.start) + ch.toString() + text.substr(caret.start);
  }
  caret.start += ch.length;
  caret.end = caret.start;
  return text;
};

const mousedown = (e: any) => {
  if (!props.input) return;
  if ((props.options as any).preventClickEvent) e.preventDefault();

  inputScrollLeft.value = props.input?.scrollLeft;
  nextTick(() => {
    if (currentKeySet.value === 'city') {
      setTimeout(()=>changeKeySet('capsed'), 200);
    }
  })
};

const clickKey = (e: any, key: any) => {
  if (!props.input) return;
  if ((props.options as any).preventClickEvent) e.preventDefault();

  let caret = getCaret();
  let text = props.input?.value;

  let addChar = null;
  if (typeof key == "object") {
    if (key.keySet) {
      toggleKeySet(key.keySet);
    }
    else if (key.func) {
      switch (key.func) {

        case "backspace": {
          text = backspace(caret, text);
          break;
        }

        case "accept": {
          if (props.accept)
            props.accept(text);
          return;
        }

        case "cancel": {
          if (props.cancel)
            props.cancel();
          return;
        }

        case "next": {
          if (props.next)
            props.next();
          return;
        }

      }
    } else {
      addChar = key.key;
    }

  } else {
    addChar = key;
  }

  if (addChar) {
    if (props.input?.maxLength <= 0 || text.length < props.input?.maxLength) {
      if ((props.options as any).useKbEvents) {
        let e = document.createEvent("Event");
        e.initEvent("keydown", true, true);
        (e as any).which = (e as any).keyCode = addChar.charCodeAt();
        if (props.input?.dispatchEvent(e)) {
          text = insertChar(caret, text, addChar);
        }
      } else {
        text = insertChar(caret, text, addChar);
      }
    }

    if (currentKeySet.value == "shifted")
      changeKeySet("default");
  }

  if (modelValue.value) {
    modelValue.value.value = text;
  }
  setFocusToInput(caret);

  if (props.change)
    props.change(text, addChar);

  if (props.input?.maxLength > 0 && text.length >= props.input?.maxLength) {
    // The value reached the maxLength
    if (props.next)
      props.next();
  }

  // trigger 'input' Event
  props.input?.dispatchEvent(new Event("input", { bubbles: true }));

};

const setFocusToInput = (caret: { start: number; end: number }) => {
  props.input?.focus();
  if (caret && supportsSelection()) {
    if (modelValue.value) {
      modelValue.value.selectionStart = caret.start;
      modelValue.value.selectionEnd = caret.end;
    }
  }
}
</script>

<style lang="scss" scoped>
$width: 40;
$height: 2.2em;
$margin: 0.5em;
$radius: 0.35em;

.vehicle-number-keyboard {

  .keyboard {
    width: 100%;
    margin: 0;

    .line {
      display: flex;
      justify-content: space-around;

      &:not(:last-child) {
        margin-bottom: $margin;
      }
    }

    .key {
      &:not(:last-child) {
        margin-right: $margin;
      }

      flex: $width;
      //width: $btnW;
      height: $height;
      line-height: $height;
      overflow: hidden;

      vertical-align: middle;
      border: 1px solid #ccc;
      color: #333;
      background-color: #fff;
      box-shadow: 0px 2px 2px rgba(0, 0, 0, .6);
      border-radius: $radius;

      font-size: 1.25em;
      text-align: center;
      white-space: nowrap;
      user-select: none;
      cursor: pointer;


      &.backspace {
        background-position: center center;
        background-repeat: no-repeat;
        background-size: 15%;
      }

      &.half {
        flex: $width / 2;
      }

      &.control {
        color: #fff;
        background-color: #7d7d7d;
        border-color: #656565;
      }

      &.featured {
        color: #fff;
        background-color: #337ab7;
        border-color: #2e6da4;
      }

      &:hover {
        color: #333;
        background-color: #d6d6d6;
        border-color: #adadad;
      }

      &:active {
        transform: scale(.98); // translateY(1px);
        color: #333;
        background-color: #d4d4d4;
        border-color: #8c8c8c;
      }

      &.activated {
        color: #fff;
        background-color: #5bc0de;
        border-color: #46b8da;
      }

    }

    // .key
    /*
  // Apple style
  .key {
    color: #aaa;
    //font: bold 9pt arial;
    background: #eff0f2;
    border-radius: 4px;
    border-top: 1px solid #ddd;
    box-shadow: 
      inset 0 0 25px #e8e8e8,
      0 1px 0 #c3c3c3,
      0 2px 0 #c9c9c9,
      0 2px 3px #333;
    text-shadow: 0px 1px 0px #f5f5f5;

    &.control {
      box-shadow: 
        0 1px 0 #c3c3c3,
        0 2px 0 #c9c9c9,
        0 2px 3px #333;
      text-shadow: 0px 1px 0px #777;
    }

    &:hover {
      color: #aaa;
      background-color: inherit;
      border-color: inherit;
    }

    &:active {
      color: #888;
      background: #ebeced;
      transform: translateY(3px);
      box-shadow: inset 0 0 25px #ddd, 0 0 3px #333;
      border-top: 1px solid #eee;
    }
  }*/

    .placeholder {
      flex: $width / 2;
      height: $height;
      line-height: $height;

      &:not(:last-child) {
        margin-right: $margin;
      }
    }


    &:before,
    &:after {
      content: "";
      display: table;
    }

    &:after {
      clear: both;
    }
  }

  // .keyboard

}

// .vue-touch-keyboard
</style>
