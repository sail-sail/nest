export const Layouts: {
  [key: string]: any;
} = {
  "carno": {

    _meta: {
      "tab": { key: "\t", text: "Tab", width: 60, classes: "control" },
      "shiftl": { keySet: "capsed", text: "Shift", width: 100, classes: "control" },
      "shiftr": { keySet: "shifted", text: "Shift", width: 100, classes: "control" },
      "caps": { keySet: "capsed", text: "ABC", width: 80, classes: "control" },
      "space": { key: " ", text: "Space", width: 180 },
      "enter": { key: "\r\n", text: "Enter", width: 80, classes: "control" },
      "backspace": { func: "backspace", text: "回退", classes: "control backspace", width: 65 },
      "accept": { func: "accept", text: "关闭", classes: "control featured" },
      "next": { func: "next", text: "Next", classes: "control featured hiddenClass" },
      "city": { keySet: "city", text: "省", classes: "control" },
      "abc": { keySet: "capsed", text: "ABC", width: 100, classes: "control" },
    },

    city: [
      "京 津 渝 沪 冀 晋 辽 吉 黑 苏 {backspace}",
      "浙 皖 闽 赣 鲁 豫 鄂 湘 粤 琼",
      "川 贵 云 陕 甘 青 蒙 桂 宁 新",
      "{abc} 藏 使 领 警 学 港 澳 {accept}",
    ],

    capsed: [
      "1 2 3 4 5 6 7 8 9 0 {backspace}",
      "Q W E R T Y U I O P",
      "A S D F G H J K L",
      "Z X C V B N M",
      "{city} {accept}"
    ]
  },
  "normal": {

    _meta: {
      "tab": { key: "\t", text: "Tab", width: 60, classes: "control" },
      "shiftl": { keySet: "shifted", text: "Shift", width: 100, classes: "control" },
      "shiftr": { keySet: "shifted", text: "Shift", width: 100, classes: "control" },
      "caps": { keySet: "capsed", text: "Caps lock", width: 80, classes: "control" },
      "space": { key: " ", text: "Space", width: 180 },
      "enter": { key: "\r\n", text: "Enter", width: 80, classes: "control" },
      "backspace": { func: "backspace", classes: "control backspace", width: 65 },
      "accept": { func: "accept", text: "关闭", classes: "control featured" },
      "next": { func: "next", text: "Next", classes: "control featured hiddenClass" }
    },

    default: [
      "` 1 2 3 4 5 6 7 8 9 0 - = {backspace}",
      "{tab} q w e r t y u i o p [ ] \\",
      "{caps} a s d f g h j k l ; ' {enter}",
      "{shiftl} z x c v b n m , . / {shiftr}",
      "{next} {space} {accept}"
    ],
    shifted: [
      "~ ! @ # $ % ^ & * ( ) _ + {backspace}",
      "{tab} Q W E R T Y U I O P { } |",
      "{caps} A S D F G H J K L : \" {enter}",
      "{shiftl} Z X C V B N M < > ? {shiftr}",
      "{next} {space} {accept}"
    ],

    capsed: [
      "` 1 2 3 4 5 6 7 8 9 0 - = {backspace}",
      "{tab} Q W E R T Y U I O P [ ] \\",
      "{caps} A S D F G H J K L ; ' {enter}",
      "{shiftl} Z X C V B N M , . / {shiftr}",
      "{next} {space} {accept}"
    ]
  },

  "compact": {

    _meta: {
      "default": { keySet: "default", text: "abc", classes: "control" },
      "alpha": { keySet: "default", text: "Abc", classes: "control" },
      "shift": { keySet: "shifted", text: "ABC", classes: "control" },
      "numbers": { keySet: "numbers", text: "123", classes: "control" },
      "space": { key: " ", text: "Space", width: 200 },
      "backspace": { func: "backspace", classes: "control" },
      "accept": { func: "accept", text: "关闭", classes: "control featured" },
      "next": { func: "next", text: "Next", classes: "featured hiddenClass" },
      "zero": { key: "0", width: 130 }
    },

    default: [
      "q w e r t y u i o p",
      " a s d f g h j k l ",
      "{shift} z x c v b n m {backspace}",
      "{numbers} , {space} . {next} {accept}"
    ],

    shifted: [
      "Q W E R T Y U I O P",
      " A S D F G H J K L ",
      "{default} Z X C V B N M ",
      "{numbers} _ {space} {backspace} {next} {accept}"
    ],

    numbers: [
      "1 2 3",
      "4 5 6",
      "7 8 9",
      "  {alpha} . {zero} {backspace} {next} {accept}"
    ]
  },

  "numeric": {

    _meta: {
      "backspace": { func: "backspace", classes: "control" },
      "accept": { func: "accept", text: "关闭", classes: "control featured" },
      "next": { func: "next", text: "Next", classes: "control featured hiddenClass" },
      "zero": { key: "0", width: 130 }
    },

    default: [
      "1 2 3",
      "4 5 6",
      "7 8 9",
      "_ - . {zero} {backspace} {next} {accept}"
    ]
  }

}
