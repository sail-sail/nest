const {
  readdir,
  readFile,
  lstat,
} = require("node:fs/promises");

const SparkMD5 = require("spark-md5");

const {
  initContext,
} = require("./database/Context");

const path = require("node:path");

let _menuModels = undefined;
let _permitModels = undefined;
let _menuModelMap = undefined;

const debugRoute = process.env.PERMIT_SCAN_DEBUG_ROUTE?.trim();

const fileContentCache = new Map();

function normalizeRoutePath(route) {
  let normalized = route.trim();
  if (normalized.endsWith(",")) {
    normalized = normalized.substring(0, normalized.length - 1).trim();
  }
  if (
    normalized.startsWith('"') ||
    normalized.startsWith("'") ||
    normalized.startsWith("`")
  ) {
    normalized = normalized.substring(1, normalized.length - 1);
  }
  return normalized;
}

function joinRoutePath(parentPath, childPath) {
  if (!childPath) {
    return parentPath;
  }
  const parentPath0 = parentPath.endsWith("/")
    ? parentPath.substring(0, parentPath.length - 1)
    : parentPath;
  const childPath0 = childPath.startsWith("/")
    ? childPath.substring(1)
    : childPath;
  return `${ parentPath0 }/${ childPath0 }`;
}

function shouldInferLabelFromNearbyLines(line) {
  return /v-if\s*=|v-show\s*=|:disabled\s*=|:hidden\s*=/.test(line);
}

function mergePermitLabels(lbl1, lbl2, code) {
  const labels = [
    ...String(lbl1 || "").split("/"),
    ...String(lbl2 || "").split("/"),
  ].map((item) => item.trim()).filter(Boolean);
  const hasRealLabel = labels.some((item) => item !== code);
  const filteredLabels = hasRealLabel
    ? labels.filter((item) => item !== code)
    : labels;
  return Array.from(new Set(filteredLabels)).join("/");
}

function extractViewInfoFromLine(line) {
  const importMatch = line.match(/component:\s*\(\)\s*=>\s*import\(\s*(["'`])(.*?)\1\s*\)/);
  if (!importMatch) {
    return null;
  }
  const importPath = importMatch[2];
  if (!importPath.includes("/views/")) {
    return null;
  }
  const relativePath = importPath.replace(/^@\/views\//, "");
  const lastSlash = relativePath.lastIndexOf("/");
  if (lastSlash < 0) {
    return null;
  }
  const viewFile = path.resolve(__dirname, "..", "views", relativePath);
  return {
    viewDir: path.dirname(viewFile),
    viewFile,
  };
}

function resolveRoutePath(lines, lineIndex) {
  const routeParts = [ ];
  for (let i = lineIndex - 1; i >= 0; i--) {
    const tmp = lines[i].trim();
    if (!tmp.startsWith("path:")) {
      continue;
    }
    const routePart = normalizeRoutePath(tmp.replace("path:", "").trim());
    routeParts.unshift(routePart);
    if (routePart.startsWith("/")) {
      break;
    }
  }
  if (!routeParts.length || !routeParts[0].startsWith("/")) {
    return "";
  }
  let routePath = routeParts[0];
  for (const routePart of routeParts.slice(1)) {
    routePath = joinRoutePath(routePath, routePart);
  }
  return routePath;
}

async function readText(ph) {
  if (fileContentCache.has(ph)) {
    return fileContentCache.get(ph);
  }
  const str = await readFile(ph, "utf-8");
  fileContentCache.set(ph, str);
  return str;
}

async function getHelperRoutePathMap(dir) {
  const key = `helper:${ dir }`;
  if (fileContentCache.has(key)) {
    return fileContentCache.get(key);
  }
  const helperRoutePathMap = new Map();
  const files = await readdir(dir);
  for (const file of files) {
    if (!file.endsWith(".ts") && !file.endsWith(".js")) {
      continue;
    }
    const ph = path.resolve(dir, file);
    const str = await readText(ph);
    const matches = str.matchAll(/export\s+function\s+(\w+)\s*\(\s*\)\s*(?::\s*[^{]+)?\s*\{\s*return\s+(["'`])(.*?)\2\s*;\s*\}/g);
    for (const item of matches) {
      helperRoutePathMap.set(item[1], item[3]);
    }
  }
  fileContentCache.set(key, helperRoutePathMap);
  return helperRoutePathMap;
}

async function getViewPagePath(ph) {
  const key = `page:${ ph }`;
  if (fileContentCache.has(key)) {
    return fileContentCache.get(key);
  }
  const str = await readText(ph);
  let pagePath = "";
  const directMatch = str.match(/const\s+pagePath\s*=\s*(["'`])(.*?)\1\s*;/);
  if (directMatch) {
    pagePath = directMatch[2].trim();
  }
  if (!pagePath) {
    const helperMatch = str.match(/const\s+pagePath\s*=\s*(\w+)\(\s*\)\s*;/);
    if (helperMatch) {
      const helperRoutePathMap = await getHelperRoutePathMap(path.dirname(ph));
      pagePath = helperRoutePathMap.get(helperMatch[1]) || "";
    }
  }
  fileContentCache.set(key, pagePath);
  return pagePath;
}

async function getViewFilesByRoute(viewDir, viewFile, routePath) {
  const viewFiles = [ ];
  await treeFiles(viewDir, async (ph) => {
    if (!ph.endsWith(".vue")) {
      return;
    }
    const pagePath = await getViewPagePath(ph);
    if (debugRoute && routePath === debugRoute) {
      console.log("[permit_scan][pagePath]", {
        routePath,
        file: path.relative(path.resolve(__dirname, ".."), ph).replace(/\\/g, "/"),
        pagePath,
      });
    }
    if (pagePath === routePath) {
      viewFiles.push(ph);
    }
  });
  if (debugRoute && routePath === debugRoute) {
    console.log("[permit_scan][viewFiles]", {
      routePath,
      viewDir: path.relative(path.resolve(__dirname, ".."), viewDir).replace(/\\/g, "/"),
      viewFile: path.relative(path.resolve(__dirname, ".."), viewFile).replace(/\\/g, "/"),
      matchedViewFiles: viewFiles.map((ph) => path.relative(path.resolve(__dirname, ".."), ph).replace(/\\/g, "/")),
    });
  }
  if (viewFiles.length) {
    return viewFiles;
  }
  if (viewFile.endsWith(".vue")) {
    if (debugRoute && routePath === debugRoute) {
      console.log("[permit_scan][fallbackViewFile]", {
        routePath,
        fallbackViewFile: path.relative(path.resolve(__dirname, ".."), viewFile).replace(/\\/g, "/"),
      });
    }
    return [ viewFile ];
  }
  return [ ];
}

/**
 * 获取所有菜单
 */
async function findAllMenu(context) {
  if (_menuModels) {
    return _menuModels;
  }
  const sql = `
    SELECT
      t.*
    FROM
      base_menu t
  `;
  const [ rows ] = await context.conn.query(sql);
  _menuModels = rows;
  _menuModelMap = new Map(rows.map((item) => [ item.route_path, item ]));
  return rows;
}

/**
 * 获取所有权限
 */
async function findAllPermit(context) {
  if (_permitModels) {
    return _permitModels;
  }
  const sql = `
    SELECT
      t.*
    FROM
      base_permit t
  `;
  const [ rows ] = await context.conn.query(sql);
  _permitModels = rows;
  return rows;
}

function shortUuidV4(str) {
  const hash = SparkMD5.hash(str, true);
  return Buffer.from(hash, "binary").toString("base64").substring(0, 22);
}

/**
 * 保存权限
 */
async function savePermit(context, model) {
  // 如果记录已经存在, 则不插入
  {
    const permit_models = await findAllPermit(context);
    const model0 = permit_models.find((item) => {
      return item.id === model.id;
    });
    if (model0) {
      const lbl = mergePermitLabels(model0.lbl, model.lbl, model.code);
      if (
        model0.menu_id !== model.menu_id ||
        model0.code !== model.code ||
        model0.lbl !== lbl ||
        model0.order_by !== model.order_by
      ) {
        const sql = `
          update base_permit
          set
            menu_id = ?,
            code = ?,
            lbl = ?,
            order_by = ?,
            is_sys = 1
          where
            id = ?
        `;
        const args = [
          model.menu_id,
          model.code,
          lbl,
          model.order_by,
          model0.id,
        ];
        try {
          await context.conn.execute(sql, args);
        } catch (err) {
          console.error(model);
          throw err;
        }
      }
      return;
    }
  }
  const sql = `
    insert into base_permit (
      id,
      menu_id,
      code,
      lbl,
      order_by,
      is_sys
    ) VALUES (
      ?,
      ?,
      ?,
      ?,
      ?,
      1
    )
  `;
  const args = [
    model.id,
    model.menu_id,
    model.code,
    model.lbl,
    model.order_by,
  ];
  try {
    await context.conn.execute(sql, args);
  } catch (err) {
    console.error(model);
    throw err;
  }
}

/**
 * 删除权限
 */
async function deletePermit(context, id) {
  const sql = `
    delete from
      base_permit
    where
      id = ?
  `;
  const args = [
    id,
  ];
  await context.conn.execute(sql, args);
}

/**
 * 根据路由获取菜单
 */
async function getMenuByPath(context, route_path) {
  if (!_menuModelMap) {
    await findAllMenu(context);
  }
  return _menuModelMap.get(route_path);
}

const permitCallReg = /permit\s*\(\s*(["'`])(.*?)\1(?:\s*,\s*(["'`])(.*?)\3)?\s*\)/g;
const chineseReg = /[\u4E00-\u9FA5]/g;

function extractTopLevelTemplateBlock(str) {
  const openMatch = str.match(/<template\b[^>]*>/i);
  if (!openMatch || openMatch.index == null) {
    return "";
  }
  const openTagStart = openMatch.index;
  const openTagEnd = str.indexOf(">", openTagStart);
  if (openTagEnd < 0) {
    return "";
  }
  const tagReg = /<\/?template\b[^>]*>/ig;
  tagReg.lastIndex = openTagEnd + 1;
  let depth = 1;
  while (true) {
    const match = tagReg.exec(str);
    if (!match || match.index == null) {
      break;
    }
    const tag = match[0];
    if (/^<\/template\b/i.test(tag)) {
      depth--;
      if (depth === 0) {
        return str.substring(openTagEnd + 1, match.index);
      }
    } else {
      depth++;
    }
  }
  return "";
}

async function getPermits(ph) {
  const str = await readText(ph);
  const text = ph.endsWith(".vue")
    ? extractTopLevelTemplateBlock(str)
    : str;
  const permits = [ ];
  const lines = text.split(/\r?\n/);

  let order_by = 1;
  for (let index = 0; index < lines.length; index++) {
    const line = lines[index];
    const matches = Array.from(line.matchAll(permitCallReg));
    if (!matches.length) {
      continue;
    }
    for (const item of matches) {
      let code = item[2].trim();
      let name = (item[4] || "").trim();
      if (!name && shouldInferLabelFromNearbyLines(line)) {
        for (let offset = 0; offset < 8; offset++) {
          const candidateLine = lines[index + offset];
          if (!candidateLine) {
            continue;
          }
          const candidateText = candidateLine.trim();
          if (!candidateText || candidateText.includes("permit(")) {
            continue;
          }
          const arrTmp = candidateText.match(chineseReg);
          if (!arrTmp) {
            continue;
          }
          name = arrTmp.join("").trim();
          if (name) {
            break;
          }
        }
      }
      const oldPerm = permits.find((item2) => item2.code === code);
      if (oldPerm) {
        if (name) {
          oldPerm.name = mergePermitLabels(oldPerm.name, name, code);
        }
        continue;
      }
      permits.push({
        ph,
        code,
        name,
        order_by,
      });
      order_by++;
    }
  }
  for (const permit of permits) {
    if (!permit.name) {
      permit.name = permit.code;
    }
  }
  return permits;
}

async function treeFiles(root, callback) {
  async function tmpFn(ph) {
    const files = await readdir(ph);
    for (const file of files) {
      const ph2 = `${ ph }/${ file }`;
      const stat = await lstat(ph2);
      if (stat.isDirectory()) {
        await tmpFn(ph2);
      } else {
        await callback(ph2);
      }
    }
  }
  await tmpFn(root);
}

async function exec(context) {
  const permit_models = await findAllPermit(context);
  let files = await readdir(path.resolve(__dirname, "..", "router"));
  files = files.filter((file) => {
    return ![
      "index.ts",
      "util.ts",
    ].includes(file);
  });
  const permitModelsMap = new Map();
  for (const file of files) {
    const str = await readText(path.resolve(__dirname, "..", "router", file));
    const lines = str.split(/\r?\n/);
    for (let k = 0; k < lines.length; k++) {
      const line = lines[k].trim();
      const viewInfo = extractViewInfoFromLine(line);
      if (!viewInfo) {
        continue;
      }
      const route = resolveRoutePath(lines, k);
      if (!route) {
        throw new Error(`${ file } 路由不存在`);
      }
      const menuModel = await getMenuByPath(context, route);
      if (!menuModel) {
        continue;
      }
      console.log(route, menuModel.lbl);
      const viewFiles = await getViewFilesByRoute(viewInfo.viewDir, viewInfo.viewFile, route);
      for (const ph of viewFiles) {
        const permits = await getPermits(ph);
        const permitModels = permits.map((item) => ({
          id: shortUuidV4(
            JSON.stringify({
              menu_id: menuModel.id,
              code: item.code,
            }),
          ),
          ph: path.relative(path.resolve(__dirname, ".."), ph).replace(/\\/g, "/"),
          menu_id: menuModel.id,
          code: item.code,
          lbl: item.name,
          order_by: item.order_by,
        }));

        for (const permitModel of permitModels) {
          const key = `${ permitModel.menu_id }::${ permitModel.code }`;
          const existingModel = permitModelsMap.get(key);
          if (!existingModel) {
            permitModelsMap.set(key, permitModel);
            continue;
          }
          existingModel.lbl = mergePermitLabels(existingModel.lbl, permitModel.lbl, permitModel.code);
          existingModel.order_by = Math.min(existingModel.order_by, permitModel.order_by);
        }
      }
    }
  }

  const permitModelsAll = Array.from(permitModelsMap.values());
  for (const permitModel of permitModelsAll) {
    await savePermit(context, permitModel);
  }
  _permitModels = undefined;
  let deletedCount = 0;
  for (const permit_model of permit_models) {
    const has = permitModelsAll.find((item) => {
      return item.menu_id === permit_model.menu_id && item.code === permit_model.code;
    });
    if (!has) {
      console.log("删除", permit_model.id, permit_model.code, permit_model.lbl);
      await deletePermit(context, permit_model.id);
      deletedCount++;
    }
  }
  console.log(`权限扫描完成: ${ permitModelsAll.length } 条权限，删除 ${ deletedCount } 条旧权限`);
}

(async function() {
  const context = await initContext();
  try {
    await exec(context);
  } catch (err) {
    console.error(err);
  } finally {
    context.end();
  }
})();
