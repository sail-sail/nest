/* eslint-disable @typescript-eslint/no-var-requires */
const {
  readdir,
  readFile,
  lstat,
  appendFile,
  writeFile,
} = require("node:fs/promises");

const SparkMD5 = require("spark-md5");

const {
  initContext,
} = require("./database/Context");

let _menuModels = undefined;

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
    WHERE
      t.is_deleted = 0
  `;
  const [ rows ] = await context.conn.query(sql);
  _menuModels = rows;
  return rows;
}

let _permitModels = undefined;

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
    WHERE
      t.is_deleted = 0
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
  const permitModels = await findAllPermit(context);
  const permitModel = permitModels.find((permitModel) => {
    return permitModel.menu_id === model.menu_id && permitModel.code === model.code;
  });
  if (permitModel) {
    if (permitModel.lbl === model.lbl) {
      return;
    }
    const sql = `
      UPDATE
        base_permit
      SET
        lbl = ?,
        is_sys = 1
      WHERE
        id = ?
    `
    const args = [
      model.lbl,
      permitModel.id,
    ];
    await context.conn.execute(sql, args);
    return;
  }
  const sql = `
    INSERT INTO base_permit (
      id,
      menu_id,
      code,
      lbl,
      is_sys
    ) VALUES (
      ?,
      ?,
      ?,
      ?,
      1
    )
  `;
  const id = shortUuidV4(
    JSON.stringify({
      menu_id: model.menu_id,
      code: model.code,
    }),
  );
  const args = [
    id,
    model.menu_id,
    model.code,
    model.lbl,
  ];
  await context.conn.execute(sql, args);
}

/**
 * 删除权限
 */
async function deletePermit(context, id) {
  const sql = `
    UPDATE
      base_permit
    SET
      is_deleted = 1
    WHERE
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
  const menuModels = await findAllMenu(context);
  const menuModel = menuModels.find((menuModel) => {
    return menuModel.route_path === route_path;
  });
  return menuModel;
}

async function getPermits(ph){
  const str = await readFile(ph, "utf-8");
  const permits = [ ];
  
  const arr = str.match(/permit\('(.*)?'\)/g);
  if (!arr) {
    return permits;
  }
  for (const item of arr) {
    const code = item.substring(8, item.length - 2);
    let name = "";
    let hasItem = false;
    for (const item2 of str.split("\n")) {
      if (item2.includes(item)) {
        hasItem = true;
        continue;
      }
      if (hasItem) {
        const arrTmp = item2.match(/[\u4E00-\u9FA5]/g);
        if (!arrTmp) {
          continue;
        }
        name = arrTmp.join("");
        break;
      }
    }
    name = name.trim();
    if (!name) {
      throw new Error(`name is empty! code: ${ code }, ph: ${ ph }`);
    }
    const oldPerm = permits.find((item2) => item2.code === code);
    if (oldPerm) {
      if (oldPerm.name !== name) {
        oldPerm.name = oldPerm.name + "/" + name;
      }
      continue;
    }
    permits.push({
      code,
      name,
    });
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
  let files = await readdir(`${ __dirname }/../router`);
  files = files.filter((file) => {
    return ![
      "index.ts",
      "util.ts",
    ].includes(file);
  });
  const permitModelsAll = [ ];
  for (const file of files) {
    const str = await readFile(`${ __dirname }/../router/${ file }`, "utf-8");
    const lines = str.split("\n");
    for (let k = 0; k < lines.length; k++) {
      let line = lines[k];
      line = line.trim();
      if (line.startsWith(`component: () => import("@`)) {
        line = line.replace(`component: () => import("@/views`, "");
        line = line.substring(0, line.lastIndexOf("/"));
        // 向上找到路由
        let route = "";
        let i = k - 1;
        while (i >= 0) {
          let tmp = lines[i];
          tmp = tmp.trim();
          if (tmp.startsWith("path:")) {
            route = tmp.replace("path:", "").trim();
            if (route.endsWith(",")) {
              route = route.substring(0, route.length - 1).trim();
            }
            if (route.startsWith('"') || route.startsWith("'") || route.startsWith("`")) {
              route = route.substring(1, route.length - 1);
            }
            if (route.startsWith("/")) {
              break;
            }
          }
          i--;
        }
        if (!route) {
          throw new Error(`${ file } 路由不存在`);
        }
        // 获取这个路由对应的菜单
        const menuModel = await getMenuByPath(context, route);
        if (!menuModel) {
          continue;
        }
        console.log(route, menuModel.lbl);
        line = `${ __dirname }/../views/${ line }`;
        await treeFiles(line, async (ph) => {
          if (!ph.endsWith(".vue")) {
            return;
          }
          // code name
          const permits = await getPermits(ph);
          const permitModels = permits.map((item) => ({
            menu_id: menuModel.id,
            code: item.code,
            lbl: item.name,
          }));
          for (const permitModel of permitModels) {
            permitModelsAll.push(permitModel);
            await savePermit(context, permitModel);
          }
        });
      }
    }
  }
  // 删除多余的权限
  _permitModels = undefined;
  const permitModels2 = await findAllPermit(context);
  for (const permitModel of permitModels2) {
    const has = permitModelsAll.find((item) => {
      return item.menu_id === permitModel.menu_id && item.code === permitModel.code;
    });
    if (!has) {
      console.log("删除", permitModel.id, permitModel.code, permitModel.lbl);
      await deletePermit(context, permitModel.id);
    }
  }
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
