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

const path = require("node:path");

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
  const id = shortUuidV4(
    JSON.stringify({
      ph: model.ph,
      code: model.code,
    }),
  );
  // 如果记录已经存在, 则不插入
  {
    const res = await context.conn.query(
      `select * from base_permit where menu_id = ? and code = ?`,
      [
        model.menu_id,
        model.code,
      ],
    );
    const model0 = res[0][0];
    if (model0) {
      const lbl0Arr = model0.lbl.split("，");
      if (!lbl0Arr.includes(model.lbl)) {
        lbl0Arr.push(model.lbl);
      }
      const lbl = lbl0Arr.join("，");
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
    id,
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
  const menuModels = await findAllMenu(context);
  const menuModel = menuModels.find((menuModel) => {
    return menuModel.route_path === route_path;
  });
  return menuModel;
}

const reg1 = /permit\('(.*)?'\)/g;
const reg2 = /[\u4E00-\u9FA5]/g;
const reg3 = /'(.*)?,(.*)?'/g;

async function getPermits(ph){
  const str = await readFile(ph, "utf-8");
  const permits = [ ];
  
  const arr = str.match(reg1);
  if (!arr) {
    return permits;
  }
  let order_by = 1;
  for (const item of arr) {
    let code = item.substring(8, item.length - 2);
    let name = "";
    let hasItem = false;
    const codeTmpArr = code.match(reg3);
    if (codeTmpArr) {
      const codeArr = code.split(codeTmpArr[0]);
      code = codeArr[0];
      name = codeArr[1];
    } else {
      for (const item2 of str.split("\n")) {
        if (item2.includes(item)) {
          hasItem = true;
          continue;
        }
        if (hasItem) {
          const arrTmp = item2.match(reg2);
          if (!arrTmp) {
            continue;
          }
          name = arrTmp.join("");
          break;
        }
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
      ph,
      code,
      name,
      order_by,
    });
    order_by++;
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
            ph: path.relative(`${ __dirname }/../`, ph).replace(/\\/g, "/"),
            menu_id: menuModel.id,
            code: item.code,
            lbl: item.name,
            order_by: item.order_by,
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
