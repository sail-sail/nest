const fs = require("fs");

const wxCssReg1 = new RegExp(
	"([a-z]*-*)?(align|animate|backdrop|bg|border|box|container|content|cursor|display|divide|filter|flex|font|gap|grid|h|justify|list|m|opacity|order|outline|overflow|p|place|ring|select|shadow|space|table|text|transform|transition|underline|w|z|rounded)~=",
	"gms"
);
const wxCssReg2 = new RegExp(
	'(?<=\\s,?\\[)(dark-+)?(align|animate|backdrop|bg|border|box|container|content|cursor|display|divide|filter|flex|font|gap|grid|h|justify|list|(m|m(t|l|b|r))|opacity|order|outline|overflow|(p|p(t|l|b|r))|place|ring|select|shadow|space|table|text|transform|transition|underline|w|z|rounded).*?(?==""])',
	"gms"
);

const wxCodeReg1 = new RegExp(
	'\\s([a-z]*-*)?(align|animate|backdrop|bg|border|box|container|content|cursor|display|divide|filter|flex|font|gap|grid|h|justify|list|m|opacity|order|outline|overflow|p|place|ring|select|shadow|space|table|text|transform|transition|underline|w|z|rounded)=".*?"',
	"gms"
);

const wxCodeReg2 = new RegExp(
	'(style=".*?")|(data-css-.*?".*?")|(class=".*?")|(?<=\\s)(dark-+)?((align|animate|backdrop|bg|box|content|cursor|display|divide|font|gap|h|justify|list|m|opacity|order|overflow|p|place|select|space|text|w|z|bottom|right|left)-|(?<=\\s)(border|filter|flex|grid|outline|ring|shadow|table|transform|(all:)?transition|underline|rounded|m|m(t|l|b|r)|p(t|l|b|r)|op|fw)-?).*?(?=\\s)|(container|contents|absolute)|(hover=".*?")',
	"g"
);

// 默认是unocss
let source = "unocss";

function uniTwuCssPlugin(options) {
	let outDir = "";

	if (options) {
		source = options.source;
	}

	return {
		// 插件名称
		name: "vite:uni-twucss",
		apply: "build",

		config(config, mode) {
			if (mode.command === "build") {
				outDir = config.build.outDir;
			}
		},

		transform(code) {
			code = code.replace(/<!--.*?-->/gms, "");

			// 修改:class=""里的
			if (outDir.includes("mp-weixin")) {
				// 把类似:class="[flag?'bg-red-900':'bg-[#fafa00]']"改成:class="[flag?'bg-red-900':'bg-fafa00']"
				return code.replace(/_n\(.*?'\)/g, (match) => {
					match = match.replace(/dark:/g, "dark--");
					return match.replace(/\[|]|#/g, "");
				});
			}

			//app有.nvue文件才修改
			if (outDir.includes(".nvue")) {
				return rewriteStyleCss(code);
			}
		},

		generateBundle(_, bundle) {
			const files = Object.keys(bundle);

			if (outDir.includes("mp-weixin") || outDir.includes("mp-qq")) {
				let codeFiles = null
				if (outDir.includes("mp-weixin")) {
					codeFiles = files.filter((i) => i.endsWith(".wxml"));
				}

				if (outDir.includes("mp-qq")) {
					codeFiles = files.filter((i) => i.endsWith(".qml"));
				}

				if (!codeFiles.length) return;

				for (const file of codeFiles) {
					const chunk = bundle[file];

					if (chunk.type === "asset" && typeof chunk.source === "string") {
						chunk.source = updateWXCode(chunk.source);
					}
				}
			}
		},
		writeBundle(options, bundle) {
			const files = Object.keys(bundle);


			if (outDir.includes("mp-weixin") || outDir.includes("mp-qq")) {
				let cssFiles = null;
				if (outDir.includes("mp-weixin")) {
					cssFiles = files.filter((i) => i.endsWith(".wxss"));
				}

				if (outDir.includes("mp-qq")) {
					cssFiles = files.filter((i) => i.endsWith(".qss"));
				}

				if (!cssFiles.length) return;

				for (const file of cssFiles) {
					const bundleChunk = bundle[file];
					const currentFile = outDir + "/" + bundleChunk.fileName;

					if (
						bundleChunk.type === "asset" &&
						typeof bundleChunk.source === "string"
					) {
						bundleChunk.source = updateWXCss(bundleChunk.source);
						fs.writeFile(currentFile, bundleChunk.source, (errWF) => {
							if (errWF) {
								console.log(errWF);
							}
						});
					}
				}
			}

		},
	};
}

function updateWXCss(css) {
  if (css.includes("font-family: uniicons;")) {
    return css;
  }
	// 解决*
	css = css.replace(/\*,/g, ":not,");
	css = css.replace(/\*\s*{/g, ":not{");

	// 解决.\!
	css = css.replace(/\.\\!/gms, ".");

	// 解决[\!
	css = css.replace(/\[\\!/gms, "[");

	// 解决\:
	css = css.replace(/\\:/gms, "--");

	// 解决\/
	css = css.replace(/\\\//gms, "--");

	// 解决\<
	css = css.replace(/\\</gms, "");

	// 解决类似.grid-cols-\[auto\2c 1fr\2c 30px\]改成.grid-cols-auto1fr30px
	css = css.replace(/(?<=(-|.))\\\[.*?]/gms, (match) => {
		return match.replace(/2c|\[|\\|\.|]|\s|%|\(|\)|,/gms, "");
	});

	// [text~="sm"]修改为[data-css-text~="sm"]
	css = css.replace(wxCssReg1, (match) => {
		return match.replace(match, "data-css-" + match);
	});

	// 在,[前增加空格
	css = css.replace(/,\[/g, (match) => {
		return ` ${match}`;
	});

	//[m-2=""]转成[data-css-m-2="m-2"]
	css.replace(wxCssReg2, (match) => {
		let reg1 = new RegExp(`\\[${match}=""]`, "g");
		css = css.replace(reg1, `[data-css-${match}="${match}"]`);
	});

	css = css.replace(
		/\[animate-bounce-alt=""]/g,
		'[data-css-animate-bounce-alt="animate-bounce-alt"]'
	);

	// 移除类似.bg-#00aaff中的#
	css = css.replace(/-#/g, "-");

	// 修改>:not([hidden])~:not([hidden])
	// 暂时只有view有效果
	css = css.replace(
		/>\s*:not\(\[hidden]\)\s*~\s*:not\(\[hidden]\)/g,
		">view:not([hidden])+view:not([hidden])"
	);

	// 解决\.
	css = css.replace(/\\./gms, "--");

	return css;
}

function updateWXCode(match) {
	match = match.replace(/dark:/g, "dark--");

	// 解决类似.grid-cols-\[auto\2c 1fr\2c 30px\]改成.grid-cols-auto1fr30px
	match = match.replace(/-\[.*?]/g, (match) => {
		return match.replace(/2c|\[|\\|\.|]|\s|%|\(|\)|,/gms, "");
	});

	// 如text="sm white"改成data-css-text="sm white"
	match = match.replace(wxCodeReg1, (match1) => {
		if (!match1.includes("bind") &&
			!match1.includes("u-") &&
			!match1.includes("webp") &&
			!match1.includes("catch") &&
			!match1.includes("user-") &&
			!match1.includes("loop") &&
			!match1.includes("preview") &&
			!match1.includes("selectable") &&
			!match1.includes("maxlength")
		) {
			match1 = match1.replace(/\s/, "");
			return " data-css-" + match1;
		}

		return match1;
	});

	match = match.replace(/\/?>/g, (match1) => {
		return ` ${match1}`;
	});

	match = match.replace(/\s/g, "  ");

	// 只匹配<>或者</>里的内容
	// 如<button m-2>替换成<button data-css-m-2="m-2">
	match = match.replace(/(?!<\/)<.*?\/?>/g, (match1) => {
		return match1.replace(wxCodeReg2, (match2) => {
			if (
				!match2.includes("class=") &&
				!match2.includes("data-css-") &&
				!match2.includes("style=") &&
				!match2.includes("hover=") &&
				!match2.includes("placeholder=") &&
				!match2.includes("mode=") &&
				!match2.includes("module=") &&
				!match2.includes("muted=") &&
				!match2.includes("preview=") &&
				!match1.includes("maxlength")
			) {
				return `data-css-${match2}='${match2}'`;
			}
			return match2;
		});
	});

	// 移除类似.bg-#00aaff中的#
	match = match.replace(/class=".*?"/g, (match1) => {
		return match1.replace(/-#/g, "-");
	});

	return match;
}

// 修改style里的样式
function rewriteStyleCss(styleCss) {
	let cssArr = [],
		sourcePreFix = "--un";

	if (source !== "unocss") {
		sourcePreFix = "--tw";
	}

	styleCss = styleCss.replace(/(-webkit-)?mask-.*?;/gms, "");
	styleCss = styleCss.replace(/mask:.*?no-repeat;/gms, "");
	styleCss = styleCss.replace(/-webkit-background-color.*?;/gms, "");

	// 移除keyframes
	styleCss = styleCss.replace(/@keyframes.*?}}/gms, "");

	// 移除animate
	styleCss = styleCss.replace(/.animate-[a-z]+(-[a-z]*)*{.*?;}/gms, "");
	// 移除animation
	styleCss = styleCss.replace(/animation-[a-z]+(-[a-z]*)*:[a-z]+;.*?;/gms, "");

	styleCss = styleCss.replace(/display: -webkit-box;/gms, "");
	styleCss = styleCss.replace(/display: -ms-flexbox;/gms, "");
	styleCss = styleCss.replace(/display: -webkit-flex;/gms, "");
	styleCss = styleCss.replace(/-webkit-box-align: center;/gms, "");
	styleCss = styleCss.replace(/-ms-flex-align: center;/gms, "");
	styleCss = styleCss.replace(/-webkit-align-items: center;/gms, "");
	styleCss = styleCss.replace(/-webkit-box-pack: center;/gms, "");
	styleCss = styleCss.replace(/-ms-flex-pack: center;/gms, "");
	styleCss = styleCss.replace(/-webkit-justify-content: center;/gms, "");
	styleCss = styleCss.replace(/-webkit-transform: scale\(\d+\);/gms, "");
	styleCss = styleCss.replace(/-webkit-animation:.*?;/gms, "");
	styleCss = styleCss.replace(/animation:.*?;/gms, "");
	styleCss = styleCss.replace(/grid-template-columns:.*?;/gms, "");
	styleCss = styleCss.replace(/-webkit-box-shadow:.*?;/gms, "");

	let cssRegArr = [
		`${sourcePreFix}-bg-opacity`,
		`${sourcePreFix}-text-opacity`,
		`${sourcePreFix}-from-opacity`,
		`${sourcePreFix}-border-opacity`,
		`${sourcePreFix}-divide-opacity`,
	];

	cssRegArr.forEach((item) => {
		const cssReg1 = new RegExp(`(?<=${item}:).*?(?=;)`, "gms");

		const cssReg2 = new RegExp(`var\\(${item}\\)`, "gms");

		// 先匹配{}里的内容
		styleCss.replace(/{.*?}/gms, (repCss) => {
			// 匹配--un-bg-opacity:1;中的1
			let matchCss = repCss.match(cssReg1);
			if (matchCss) {
				if (
					// opacity默认是1，不是1的基本是另写覆盖的
					!matchCss.every((item) => {
						return item === "1";
					})
				) {
					// 移除类似--un-bg-opacity:1 !important;中的!important
					matchCss = String(matchCss).replace(/\s!important/g, "");

					matchCss = matchCss.split(",");
					// 当前有多个--un-bg-opacity时，最低的会排在后面，所以只取最后一个
					matchCss.splice(0, matchCss.length - 1);
				}

				// 目的是使--un-bg-opacity:1;和var(--un-bg-opacity)的个数一样，减少误差
				matchCss.forEach((item) => {
					cssArr.push(item);
				});
			}
		});
		// 匹配var(--un-bg-opacity)
		styleCss.replace(cssReg2, (match) => {
			cssArr.forEach((item) => {
				styleCss = styleCss.replace(match, item);
			});
		});
		cssArr = [];
	});

	let cssReg1 = new RegExp(
		`(?<=${sourcePreFix}-divide-x-reverse:).*?(?=;)`,
		"gms"
	);

	let cssReg2 = new RegExp(`var\\(${sourcePreFix}-divide-x-reverse\\)`, "gms");

	styleCss.replace(cssReg1, (match) => {
		styleCss = styleCss.replace(cssReg2, match);
	});

	cssReg1 = new RegExp(`(?<=var\\(${sourcePreFix}-empty,).*?(?=\\))`, "gms");

	cssReg2 = new RegExp(`var\\(${sourcePreFix}-empty,.*?\\)`, "gms");

	styleCss.replace(cssReg1, (match) => {
		styleCss = styleCss.replace(cssReg2, match);
	});

	cssReg1 = new RegExp(`(?<=${sourcePreFix}-shadow-inset:).*?(?=;)`, "gms");

	cssReg2 = new RegExp(`var\\(${sourcePreFix}-shadow-inset\\)`, "gms");

	styleCss.replace(cssReg1, (match) => {
		styleCss = styleCss.replace(cssReg2, match);
	});

	// -shadow-inset上面的条件会存在不成功，所以再次重新覆盖成默认的样式
	cssReg1 = new RegExp(`var\\(${sourcePreFix}-shadow-inset\\)`, "gms");
	styleCss = styleCss.replace(cssReg1, "/*!*/ /*!*/");


	cssReg1 = new RegExp(`(?<=var\\(${sourcePreFix}-shadow-color,).*?\\)`, "gms");

	cssReg2 = new RegExp(`var\\(${sourcePreFix}-shadow-color,.*?\\)\\)`, "gms");

	styleCss.replace(cssReg1, (match) => {
		styleCss = styleCss.replace(cssReg2, match);
	});

	cssReg1 = new RegExp(
		`(?<=var\\(${sourcePreFix}-ring-offset-shadow,).*?(?=\\))`,
		"gms"
	);

	cssReg2 = new RegExp(
		`var\\(${sourcePreFix}-ring-offset-shadow,.*?\\)`,
		"gms"
	);

	styleCss.replace(cssReg1, (match) => {
		styleCss = styleCss.replace(cssReg2, match);
	});

	cssReg1 = new RegExp(
		`(?<=var\\(${sourcePreFix}-ring-shadow,).*?(?=\\))`,
		"gms"
	);

	cssReg2 = new RegExp(`var\\(${sourcePreFix}-ring-shadow,.*?\\)`, "gms");

	styleCss.replace(cssReg1, (match) => {
		styleCss = styleCss.replace(cssReg2, match);
	});

	cssReg1 = new RegExp(`(?<=${sourcePreFix}-shadow:).*?(?=;)`, "gms");

	cssReg2 = new RegExp(`var\\(${sourcePreFix}-shadow\\)`, "gms");

	styleCss.replace(cssReg1, (match) => {
		// if (match.includes("rgba")) {
		styleCss = styleCss.replace(cssReg2, match);
		// }
	});

	cssReg1 = new RegExp(`(?<=${sourcePreFix}-icon:).*?\\)(?=;)`, "gms");

	cssReg2 = new RegExp(`var\\(${sourcePreFix}-icon\\)`, "gms");

	styleCss.replace(cssReg1, (match) => {
		styleCss = styleCss.replace(cssReg2, match);
	});

	cssReg1 = new RegExp(`${sourcePreFix}-icon:.*?\\);`, "gms");

	styleCss = styleCss.replace(cssReg1, "");


	cssReg1 = new RegExp(`${sourcePreFix}-.*?;`, "gms");

	styleCss = styleCss.replace(cssReg1, "");


	//nvue环境下，将tailwindcss的rgb转成rgba
	if (sourcePreFix === "--tw") {
		styleCss.replace(/(?<=color:).*\)/gm, (match) => {
			styleCss = styleCss.replace(match, rgbToRgba(match));
		});
	}
	return styleCss;
}

// rgb转rgba
function rgbToRgba(color) {
	let r, g, b, a = 1;
	let rgbaAttr = color.match(/[\d.]+/g);

	if (rgbaAttr.length >= 3) {
		let r, g, b;
		r = rgbaAttr[0];
		g = rgbaAttr[1];
		b = rgbaAttr[2];
		if (rgbaAttr[3]) {
			a = rgbaAttr[3];
		}
		return 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')';
	}
}

module.exports = uniTwuCssPlugin;
uniTwuCssPlugin["default"] = uniTwuCssPlugin;
