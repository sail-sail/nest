const mysql = require("mysql2");

const nestConfig = require("./nest_config");

const {
  createInterface,
} = require("readline");

class Context {
  // pool: Pool;
  // conn: PoolConnection;
  end() {
    this.conn.release();
    this.pool.end();
  }
};
exports.Context = Context;

async function confirmDatabaseTarget(db) {
  if (!process.stdin.isTTY || process.env.CI) {
    return;
  }

  const rl = createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  try {
    while (true) {
      const answer = await new Promise((resolve) => {
        rl.question(
          `即将连接数据库 ${ db.database || "<未设置>" }@${ db.host || "<未设置>" }:${ Number(db.port) || 3306 }，是否继续？(yes/no，默认 no): `,
          resolve,
        );
      });

      const normalized = answer.trim().toLowerCase();
      if (!normalized || normalized === "n" || normalized === "no") {
        throw new Error("已取消执行，未连接数据库。");
      }
      if (normalized === "y" || normalized === "yes") {
        return;
      }
      console.log("请输入 yes 或 no。");
    }
  } finally {
    rl.close();
  }
}

async function getPool(
  isConfirm = false,
) {
  const db = nestConfig.database;
  console.log({
    host: db.host,
    user: db.username,
    database: db.database,
    port: Number(db.port) || 3306,
  });
  
  if (isConfirm) {
    await confirmDatabaseTarget(db);
  }
  
  const pool0 = mysql.createPool({
    host: db.host,
    user: db.username,
    database: db.database,
    port: Number(db.port) || 3306,
    password: db.password,
    connectTimeout: 20 * 1000,
  });
  const pool = pool0.promise();
  return pool;
}

async function initContext(
  isConfirm = false,
) {
  const context = new Context();
  const pool = await getPool(isConfirm);
  context.pool = pool;
  const conn = await pool.getConnection();
  context.conn = conn;
  return context;
}
exports.initContext = initContext;
