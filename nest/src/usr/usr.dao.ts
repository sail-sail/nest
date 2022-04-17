import { Injectable } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { ResultSetHeader } from "mysql2/promise";
import { useContext } from "../common/interceptors/context.interceptor";
import { PageModel } from "../common/page.model";
import { isEmpty, sqlLike } from "../common/util/StringUitl";
import { UniqueException } from "../common/exceptions/unique.execption";
import { many2manyUpdate, setModelIds } from "../common/util/DaoUtil";
import { UsrModel, UsrSearch } from "./usr.model";
import { AuthDao } from "../common/auth/auth.dao";

@Injectable()
export class UsrDao {
  
  constructor(
    private readonly authDao: AuthDao,
    private readonly eventEmitter2: EventEmitter2,
  ) { }
  
  getWhereQuery(
    args: any[],
    search?: UsrSearch,
  ) {
    const context = useContext();
    let whereQuery = "";
    whereQuery += ` t.is_deleted = ?`;
    args.push(search?.is_deleted == null ? 0 : search.is_deleted);
    if (context.tenant_id) {
      whereQuery += ` and t.tenant_id = ?`;
      args.push(context.tenant_id);
    }
    if (!isEmpty(search?.id)) {
      whereQuery += ` and t.id = ?`;
      args.push(search.id);
    }
    if (search?.lbl !== undefined) {
      whereQuery += ` and t.lbl = ?`;
      args.push(search.lbl);
    }
    if (!isEmpty(search?.lblLike)) {
      whereQuery += ` and t.lbl like ?`;
      args.push(sqlLike(search.lblLike) + "%");
    }
    if (search?.username !== undefined) {
      whereQuery += ` and t.username = ?`;
      args.push(search.username);
    }
    if (!isEmpty(search?.usernameLike)) {
      whereQuery += ` and t.username like ?`;
      args.push(sqlLike(search.usernameLike) + "%");
    }
    if (search?.password !== undefined) {
      whereQuery += ` and t.password = ?`;
      args.push(search.password);
    }
    if (!isEmpty(search?.passwordLike)) {
      whereQuery += ` and t.password like ?`;
      args.push(sqlLike(search.passwordLike) + "%");
    }
    if (search?.is_enabled && search?.is_enabled?.length > 0) {
      whereQuery += ` and t.is_enabled in (?)`;
      args.push(search.is_enabled);
    }
    if (search?.role_ids && search?.role_ids.length > 0) {
      whereQuery += ` and role.id in (?)`;
      args.push(search.role_ids);
    }
    if (search?.role__lbl && search.role__lbl?.length > 0) {
      whereQuery += ` and role__lbl in (?)`;
      args.push(search.role__lbl);
    }
    if (search?.rem !== undefined) {
      whereQuery += ` and t.rem = ?`;
      args.push(search.rem);
    }
    if (!isEmpty(search?.remLike)) {
      whereQuery += ` and t.rem like ?`;
      args.push(sqlLike(search.remLike) + "%");
    }
    return whereQuery;
  }
  
  getFromQuery() {
    let fromQuery = `
      usr t
      left join usr_role
        on usr_role.usr_id = t.id
        and usr_role.is_deleted = 0
      left join role
        on usr_role.role_id = role.id
        and role.is_deleted = 0
      left join (
        select
          json_arrayagg(role.id) role_ids,
          json_arrayagg(role.lbl) _role_ids,
          usr.id usr_id
        from usr_role
        inner join role
          on role.id = usr_role.role_id
          and role.is_deleted = 0
        inner join usr
          on usr.id = usr_role.usr_id
          and usr.is_deleted = 0
        where
          usr_role.is_deleted = 0
        group by usr_id
      ) _role
        on _role.usr_id = t.id
    `;
    return fromQuery;
  }
  
  /**
   * 根据条件查找总数据数
   * @param {UsrSearch} [search]
   * @return {Promise<number>}
   * @memberof UsrDao
   */
  async findCount(
    search?: UsrSearch,
  ): Promise<number> {
    const t = this;
    
    const table = "usr";
    const method = "findCount";
    
    const [ beforeEvent ] = await t.eventEmitter2.emitAsync(`dao.before.sql.${ method }.${ table }`, { search });
    if (beforeEvent?.isReturn) return beforeEvent.data;
    
    const context = useContext();
    const args = [ ];
    let sql = `
      select
        count(1) total
      from
        ${ t.getFromQuery() }
      where
        ${ t.getWhereQuery(args, search) }
    `;
    
    const cacheKey1 = `dao.sql.${ table }`;
    const cacheKey2 = JSON.stringify({ sql, args });
    
    interface Result {
      total: number,
    }
    const model = await context.queryOne<Result>(sql, args, { cacheKey1, cacheKey2 });
    let result = model?.total || 0;
    
    const [ afterEvent ] = await t.eventEmitter2.emitAsync(`dao.after.sql.${ method }.${ table }`, { search, result });
    if (afterEvent?.isReturn) return afterEvent.data;
    
    return result;
  }
  
  /**
   * 根据搜索条件和分页查找数据
   * @param {UsrSearch} search 搜索条件
   * @memberof UsrDao
   */
  async findAll(
    search?: UsrSearch,
    pageModel?: PageModel,
  ) {
    const t = this;
    
    const table = "usr";
    const method = "findAll";
    
    const [ beforeEvent ] = await t.eventEmitter2.emitAsync(`dao.before.sql.${ method }.${ table }`, { search });
    if (beforeEvent?.isReturn) return <typeof result>beforeEvent.data;
    
    const context = useContext();
    const args = [ ];
    let sql = `
      select t.*
          ,max(role_ids) role_ids
          ,max(_role_ids) _role_ids
      from
        ${ t.getFromQuery() }
      where
        ${ t.getWhereQuery(args, search) }
      group by t.id
    `;
    if (search?.orderBy) {
      sql += ` order by ${ context.escapeId(search.orderBy) } ${ context.escapeDec(search.orderDec) }`;
    }
    if (pageModel?.pgSize) {
      sql += ` limit ${ Number(pageModel?.pgOffset) || 0 },${ Number(pageModel.pgSize) }`;
    }
    
    const cacheKey1 = `dao.sql.${ table }`;
    const cacheKey2 = JSON.stringify({ sql, args });
    
    let result = await context.query<UsrModel>(sql, args, { cacheKey1, cacheKey2 });
    for (let i = 0; i < result.length; i++) {
      const model = result[i];
      // 密码
      model.password = "";
      // 启用
      let _is_enabled = "";
      if (model.is_enabled === 1) {
        _is_enabled = "是";
      } else if (model.is_enabled === 0) {
        _is_enabled = "否";
      } else {
        _is_enabled = String(model.is_enabled);
      }
      model._is_enabled = _is_enabled;
    }
    
    const [ afterEvent ] = await t.eventEmitter2.emitAsync(`dao.after.sql.${ method }.${ table }`, { search, result });
    if (afterEvent?.isReturn) return <typeof result>afterEvent.data;
    
    return result;
  }
  
  /**
   * 获得表的唯一字段名列表
   * @return {{ uniqueKeys: string[]; uniqueComments: { [key: string]: string }; }}
   * @memberof UsrDao
   */
  getUniqueKeys(
  ): {
    uniqueKeys: string[];
    uniqueComments: { [key: string]: string };
    } {
    const uniqueKeys = [
      "lbl",
    ];
    const uniqueComments = {
      lbl: "名称",
    };
    return { uniqueKeys, uniqueComments };
  }
  
  /**
   * 通过唯一约束获得一行数据
   * @param {UsrSearch} search0
   * @memberof UsrDao
   */
  async findByUnique(
    search0: UsrSearch | UsrModel,
  ) {
    const t = this;
    const { uniqueKeys } = t.getUniqueKeys();
    if (!uniqueKeys || uniqueKeys.length === 0) return;
    const search: UsrSearch = { };
    for (let i = 0; i < uniqueKeys.length; i++) {
      const key = uniqueKeys[i];
      const val = search0[key];
      if (isEmpty(val)) {
        return;
      }
      search[key] = val;
    }
    const model = await t.findOne(search);
    return model;
  }
  
  /**
   * 根据唯一约束对比对象是否相等
   * @param {UsrModel} oldModel
   * @param {UsrModel} model
   * @return {boolean}
   * @memberof UsrDao
   */
  equalsByUnique(
    oldModel: UsrModel,
    model: UsrModel,
  ): boolean {
    const t = this;
    if (!oldModel || !model) return false;
    const { uniqueKeys } = t.getUniqueKeys();
    if (!uniqueKeys || uniqueKeys.length === 0) return false;
    let isEquals = true;
    for (let i = 0; i < uniqueKeys.length; i++) {
      const key = uniqueKeys[i];
      const oldVal = oldModel[key];
      const val = model[key];
      if (oldVal != val) {
        isEquals = false;
        break;
      }
    }
    return isEquals;
  }
  
  /**
   * 通过唯一约束检查数据是否已经存在
   * @param {UsrModel} model
   * @param {UsrModel} oldModel
   * @param {("ignore" | "throw" | "update")} uniqueType
   * @return {Promise<ResultSetHeader>}
   * @memberof UsrDao
   */
  async checkByUnique(
    model: UsrModel,
    oldModel: UsrModel,
    uniqueType: "ignore" | "throw" | "update",
  ): Promise<ResultSetHeader> {
    const t = this;
    uniqueType = uniqueType || "throw";
    const isEquals = t.equalsByUnique(oldModel, model);
    if (isEquals) {
      if (uniqueType === "throw") {
        const { uniqueKeys, uniqueComments } = t.getUniqueKeys();
        const lbl = uniqueKeys.map((key) => `${ uniqueComments[key] }: ${ model[`_${ key }`] ?? model[key] }`).join("; ");
        throw new UniqueException(`${ lbl } 已存在!`);
      }
      if (uniqueType === "update") {
        const resultSetHeader = await t.updateById(oldModel.id, model);
        return resultSetHeader;
      }
      if (uniqueType === "ignore") {
        return <ResultSetHeader> { affectedRows: 0 };
      }
    }
    return;
  }
  
  /**
   * 根据条件查找第一条数据
   * @param {UsrSearch} [search]
   * @return {Promise<UsrModel>} 
   * @memberof UsrDao
   */
  async findOne(
    search?: UsrSearch,
  ): Promise<UsrModel> {
    const t = this;
    const pageModel: PageModel = {
      pgOffset: 0,
      pgSize: 1,
    };
    const [ model ] = await t.findAll(search, pageModel);
    return model;
  }
  
  /**
   * 根据id查找数据
   * @param {string} id
   * @return {Promise<UsrModel>}
   * @memberof UsrDao
   */
  async findById(
    id: string,
  ): Promise<UsrModel> {
    const t = this;
    if (!id) return;
    const model = await t.findOne({ id });
    return model;
  }
  
  /**
   * 根据搜索条件判断数据是否存在
   * @param {UsrSearch} [search]
   * @return {Promise<boolean>} 
   * @memberof UsrDao
   */
  async exist(
    search?: UsrSearch,
  ): Promise<boolean> {
    const t = this;
    const model = await t.findOne(search);
    const exist = !!model;
    return exist;
  }
  
  /**
   * 根据id判断数据是否存在
   * @param {string} id
   * @memberof UsrDao
   */
  async existById(
    id: string,
  ): Promise<boolean> {
    const t = this;
    const table = "usr";
    const method = "existById";
    
    const [ beforeEvent ] = await t.eventEmitter2.emitAsync(`dao.before.sql.${ method }.${ table }`, { id });
    if (beforeEvent?.isReturn) return beforeEvent.data;
    
    if (!id) {
      return false;
    }
    
    const context = useContext();
    let sql = `
      select 1 e from usr where id = ? limit 1
    `;
    let args = [ id ];
    
    const cacheKey1 = `dao.sql.${ table }`;
    const cacheKey2 = JSON.stringify({ sql, args });
    
    interface Result {
      e: number,
    }
    let model = await context.queryOne<Result>(sql, args, { cacheKey1, cacheKey2 });
    let result = model?.e === 1;
    
    const [ afterEvent ] = await t.eventEmitter2.emitAsync(`dao.after.sql.${ method }.${ table }`, { id, result });
    if (afterEvent?.isReturn) return afterEvent.data;
    
    return result;
  }
  
  /**
   * 创建数据
   * @param {UsrModel} model
   * @param {({
   *   uniqueType?: "ignore" | "throw" | "update",
   * })} options? 唯一约束冲突时的处理选项, 默认为 throw,
   *   ignore: 忽略冲突
   *   throw: 抛出异常
   *   update: 更新冲突数据
   * @return {Promise<ResultSetHeader>} 
   * @memberof UsrDao
   */
  async create(
    model: UsrModel,
    options?: {
      uniqueType?: "ignore" | "throw" | "update",
    },
  ): Promise<ResultSetHeader> {
    const t = this;
    if (!model) {
      return;
    }
    const table = "usr";
    const method = "create";
    
    const [ beforeEvent ] = await t.eventEmitter2.emitAsync(`dao.before.sql.${ method }.${ table }`, { model });
    if (beforeEvent?.isReturn) return beforeEvent.data;
    
    // 启用
    if (!isEmpty(model._is_enabled) && model.is_enabled === undefined) {
      model._is_enabled = String(model._is_enabled).trim();
      if (model._is_enabled === "是") {
        model.is_enabled = 1;
      } else if (model._is_enabled === "否") {
        model.is_enabled = 0;
      }
    }
    
    const oldModel = await t.findByUnique(model);
    const resultSetHeader = await t.checkByUnique(model, oldModel, options?.uniqueType);
    if (resultSetHeader) {
      return resultSetHeader;
    }
    
    const context = useContext();
    const args = [ ];
    let sql = `
      insert into usr(
        id
        ,create_time
    `;
    if (context.tenant_id) {
      sql += `,tenant_id`;
    }
    if (context.getUsr_id() !== undefined) {
      sql += `,create_usr_id`;
    }
    if (model.lbl !== undefined) {
      sql += `,lbl`;
    }
    if (model.username !== undefined) {
      sql += `,username`;
    }
    if (!isEmpty(model.password)) {
      sql += `,password`;
    }
    if (model.is_enabled !== undefined) {
      sql += `,is_enabled`;
    }
    if (model.rem !== undefined) {
      sql += `,rem`;
    }
    sql += `) values(?,?`;
    args.push(model.id);
    args.push(context.getReqDate());
    if (context.tenant_id) {
      sql += ",?";
      args.push(context.tenant_id);
    }
    if (context.getUsr_id() !== undefined) {
      sql += `,?`;
      args.push(context.getUsr_id());
    }
    if (model.lbl !== undefined) {
      sql += `,?`;
      args.push(model.lbl);
    }
    if (model.username !== undefined) {
      sql += `,?`;
      args.push(model.username);
    }
    if (!isEmpty(model.password)) {
      sql += `,?`;
      args.push(t.authDao.getPassword(model.password));
    }
    if (model.is_enabled !== undefined) {
      sql += `,?`;
      args.push(model.is_enabled);
    }
    if (model.rem !== undefined) {
      sql += `,?`;
      args.push(model.rem);
    }
    sql += `)`;
    
    await t.delCache();
    
    let result = await context.execute(sql, args);
    // 角色
    await many2manyUpdate(model, "role_ids", { table: "usr_role", column1: "usr_id", column2: "role_id" });
    
    const [ afterEvent ] = await t.eventEmitter2.emitAsync(`dao.after.sql.${ method }.${ table }`, { model, result });
    if (afterEvent?.isReturn) return afterEvent.data;
    
    return result;
  }
  
  /**
   * 删除缓存
   * @memberof UsrDao
   */
  async delCache() {
    const table = "usr";
    const method = "delCache";
    const context = useContext();
    const cacheKey1 = `dao.sql.${ table }`;
    await context.delCache(cacheKey1);
    const foreignTables: string[] = [
      "usr_role",
      "role",
    ];
    for (let k = 0; k < foreignTables.length; k++) {
      const foreignTable = foreignTables[k];
      if (foreignTable === table) continue;
      const cacheKey1 = `dao.sql.${ foreignTable }`;
      await context.delCache(cacheKey1);
    }
  }
  
  /**
   * 根据id修改数据
   * @param {string} id
   * @param {UsrModel} model
   * @param {({
   *   uniqueType?: "ignore" | "throw" | "update",
   * })} options? 唯一约束冲突时的处理选项, 默认为 throw,
   *   ignore: 忽略冲突
   *   throw: 抛出异常
   *   create: 级联插入新数据
   * @return {Promise<ResultSetHeader>}
   * @memberof UsrDao
   */
  async updateById(
    id: string,
    model: UsrModel,
    options?: {
      uniqueType?: "ignore" | "throw" | "create",
    },
  ): Promise<ResultSetHeader> {
    const t = this;
    
    const table = "usr";
    const method = "updateById";
    
    const [ beforeEvent ] = await t.eventEmitter2.emitAsync(`dao.before.sql.${ method }.${ table }`, { id, model });
    if (beforeEvent?.isReturn) return beforeEvent.data;
    
    if (!id || !model) {
      return;
    }
    
    // 启用
    if (!isEmpty(model._is_enabled) && model.is_enabled === undefined) {
      model._is_enabled = String(model._is_enabled).trim();
      if (model._is_enabled === "是") {
        model.is_enabled = 1;
      } else if (model._is_enabled === "否") {
        model.is_enabled = 0;
      }
    }
    
    const oldModel = await t.findByUnique(model);
    if (oldModel) {
      if (oldModel.id !== id && options?.uniqueType !== "create") {
        const resultSetHeader = await t.checkByUnique(model, oldModel, options?.uniqueType);
        if (resultSetHeader) {
          return resultSetHeader;
        }
      }
    } else {
      if (options?.uniqueType === "create") {
        const resultSetHeader = await t.create({ ...model, id });
        return resultSetHeader;
      }
    }
    
    const context = useContext();
    const args = [ ];
    let sql = `
      update usr set update_time = ?
    `;
    args.push(context.getReqDate());
    if (context.getUsr_id() !== undefined) {
      sql += `,update_usr_id = ?`;
      args.push(context.getUsr_id());
    }
    if (model.lbl !== undefined) {
      if (model.lbl != oldModel?.lbl) {
        sql += `,lbl = ?`;
        args.push(model.lbl);
      }
    }
    if (model.username !== undefined) {
      if (model.username != oldModel?.username) {
        sql += `,username = ?`;
        args.push(model.username);
      }
    }
    if (!isEmpty(model.password)) {
      sql += `,password = ?`;
      args.push(t.authDao.getPassword(model.password));
    }
    if (model.is_enabled !== undefined) {
      if (model.is_enabled != oldModel?.is_enabled) {
        sql += `,is_enabled = ?`;
        args.push(model.is_enabled);
      }
    }
    if (model.rem !== undefined) {
      if (model.rem != oldModel?.rem) {
        sql += `,rem = ?`;
        args.push(model.rem);
      }
    }
    sql += ` where id = ? limit 1`;
    args.push(id);
    
    let result = await context.execute(sql, args);
    // 角色
    await many2manyUpdate(model, "role_ids", { table: "usr_role", column1: "usr_id", column2: "role_id" });
    
    await t.delCache();
    
    const [ afterEvent ] = await t.eventEmitter2.emitAsync(`dao.after.sql.${ method }.${ table }`, { id, model, result });
    if (afterEvent?.isReturn) return afterEvent.data;
    
    return result;
  }
  
  /**
   * 根据id删除数据
   * @param {string} id
   * @return {Promise<number>}
   * @memberof UsrDao
   */
  async deleteByIds(
    ids: string[],
  ): Promise<number> {
    const t = this;
    
    const table = "usr";
    const method = "deleteByIds";
    
    const [ beforeEvent ] = await t.eventEmitter2.emitAsync(`dao.before.sql.${ method }.${ table }`, { ids });
    if (beforeEvent?.isReturn) return beforeEvent.data;
    
    if (!ids || !ids.length) {
      return 0;
    }
    
    const context = useContext();
    
    let num = 0;
    let sql = `
      update usr set is_deleted = 1,delete_time = ? where id = ? limit 1
    `;
    for (let i = 0; i < ids.length; i++) {
      const id = ids[i];
      const args = [ context.getReqDate(), id ];
      const result = await context.execute(sql, args);
      num += result.affectedRows;
    }
    await t.delCache();
    
    const [ afterEvent ] = await t.eventEmitter2.emitAsync(`dao.after.sql.${ method }.${ table }`, { ids, num });
    if (afterEvent?.isReturn) return afterEvent.data;
    
    return num;
  }
  
  
  /**
   * 根据id列表还原数据
   * @param {string[]} ids
   * @return {Promise<number>}
   * @memberof UsrDao
   */
  async revertByIds(
    ids: string[],
  ): Promise<number> {
    const t = this;
    
    const table = "usr";
    const method = "create";
    
    const [ beforeEvent ] = await t.eventEmitter2.emitAsync(`dao.before.sql.${ method }.${ table }`, { ids });
    if (beforeEvent?.isReturn) return beforeEvent.data;
    
    if (!ids || !ids.length) {
      return 0;
    }
    
    const context = useContext();
    
    let num = 0;
    let sql = `
      update usr set is_deleted = 0 where id = ? limit 1
    `;
    for (let i = 0; i < ids.length; i++) {
      const id = ids[i];
      const args = [ id ];
      const result = await context.execute(sql, args);
      num += result.affectedRows;
    }
    await t.delCache();
    
    const [ afterEvent ] = await t.eventEmitter2.emitAsync(`dao.after.sql.${ method }.${ table }`, { ids, num });
    if (afterEvent?.isReturn) return afterEvent.data;
    
    return num;
  }
  
}
