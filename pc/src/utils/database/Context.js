const mysql = require("mysql2");

const nestConfig = require("./nest_config");

class Context {
  // pool: Pool;
  // conn: PoolConnection;
  end() {
    this.conn.release();
    this.pool.end();
  }
};
exports.Context = Context;

function getPool() {
  const db = nestConfig.database;
  console.log({
    host: db.host,
    user: db.username,
    database: db.database,
    port: Number(db.port) || 3306,
  });
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

async function initContext() {
  const context = new Context();
  const pool = getPool();
  context.pool = pool;
  const conn = await pool.getConnection();
  context.conn = conn;
  return context;
}
exports.initContext = initContext;
