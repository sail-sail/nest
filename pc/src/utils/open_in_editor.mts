import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import type { Plugin } from "vite";

// 编辑器命令行(VSCode 内核), 需要支持 `-r -g file:line:column`
export const OPEN_EDITOR = "buddycn";

// 位置后缀, 形如 `:12` 或 `:12:3`
const POSITION_RE = /:(\d+)(?::(\d+))?$/;

// 把 `文件:行:列` 拆成绝对路径 + 行号 + 列号
function parseTarget(root: string, file: string) {
  const position = POSITION_RE.exec(file);
  const suffix = position?.[0] ?? "";
  return {
    fileName: resolve(root, suffix ? file.slice(0, -suffix.length) : file),
    line: position?.[1] ?? "1",
    column: position?.[2] ?? "1",
  };
}

/**
 * 接管 Vite 的 /__open-in-editor, 按 `-r -g file:line:column` 调编辑器
 *
 * Vite 内置的 launch-editor 只对 code/cursor 等内置名字拼 `-g file:line:column`,
 * 遇到 buddycn 会退化成 `file line column` 三个参数, 行号/列号被当成新文件打开。
 */
export function openInEditorPlugin(editor = OPEN_EDITOR): Plugin {
  return {
    name: "codebuddy-open-in-editor",
    apply: "serve",
    configureServer(server) {
      server.middlewares.use("/__open-in-editor", (req, res) => {
        const file = new URL(req.url ?? "", "http://localhost").searchParams.get("file") ?? "";
        if (!file) {
          res.statusCode = 400;
          res.end(`missing query param "file"`);
          return;
        }

        const { fileName, line, column } = parseTarget(server.config.root, file);
        if (!existsSync(fileName)) {
          server.config.logger.warn(`[open-in-editor] 文件不存在: ${fileName}`);
          res.end();
          return;
        }

        const child = spawn(editor, [ "-r", "-g", `${fileName}:${line}:${column}` ], {
          stdio: "ignore",
          shell: process.platform === "win32",
          windowsHide: true,
        });
        child.on("error", (e) => server.config.logger.error(`[open-in-editor] ${e.message}`));
        res.end();
      });
    },
  };
}
