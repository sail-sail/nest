import { Injectable } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { ResultSetHeader } from "mysql2/promise";
import { useContext } from "../common/interceptors/context.interceptor";
import { PageModel } from "../common/page.model";
import { isEmpty, sqlLike } from "../common/util/StringUitl";
import { UniqueException } from "../common/exceptions/unique.execption";
import { many2manyUpdate, setModelIds } from "../common/util/DaoUtil";
import { Background_taskModel, Background_taskSearch } from "./background_task.model";

@Injectable()
export class Background_taskDao {
  
  constructor(
    private readonly eventEmitter2: EventEmitter2,
  ) { }
  
  getWhereQuery(
    args: any[],
    search?: Background_taskSearch,
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
    if (search?.state && search?.state?.length > 0) {
      whereQuery += ` and t.state in (?)`;
      args.push(search.state);
    }
    if (search?.type && search?.type?.length > 0) {
      whereQuery += ` and t.type in (?)`;
      args.push(search.type);
    }
    if (search?.result !== undefined) {
      whereQuery += ` and t.result = ?`;
      args.push(search.result);
    }
    if (!isEmpty(search?.resultLike)) {
      whereQuery += ` and t.result like ?`;
      args.push(sqlLike(search.resultLike) + "%");
    }
    if (search?.err_msg !== undefined) {
      whereQuery += ` and t.err_msg = ?`;
      args.push(search.err_msg);
    }
    if (!isEmpty(search?.err_msgLike)) {
      whereQuery += ` and t.err_msg like ?`;
      args.push(sqlLike(search.err_msgLike) + "%");
    }
    if (search?.begin_time && search?.begin_time?.length > 0) {
      if (search.begin_time[0] != null) {
        whereQuery += ` and t.begin_time >= ?`;
        args.push(search.begin_time[0]);
      }
      if (search.begin_time[1] != null) {
        whereQuery += ` and t.begin_time <= ?`;
        args.push(search.begin_time[1]);
      }
    }
    if (search?.end_time && search?.end_time?.length > 0) {
      if (search.end_time[0] != null) {
        whereQuery += ` and t.end_time >= ?`;
        args.push(search.end_time[0]);
      }
      if (search.end_time[1] != null) {
        whereQuery += ` and t.end_time <= ?`;
        args.push(search.end_time[1]);
      }
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
      background_task t
    `;
    return fromQuery;
  }
  
  /**
   * 根据条件查找总数据数
   * @param {Background_taskSearch} [search]
   * @return {Promise<number>}
   * @memberof Background_taskDao
   */
  async findCount(
    search?: Background_taskSearch,
  ): Promise<number> {
    const t = this;
    
    const table = "background_task";
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
    
    interface Result {
      total: number,
    }
    const model = await context.queryOne<Result>(sql, args);
    let result = model?.total || 0;
    
    const [ afterEvent ] = await t.eventEmitter2.emitAsync(`dao.after.sql.${ method }.${ table }`, { search, result });
    if (afterEvent?.isReturn) return afterEvent.data;
    
    return result;
  }
  
  /**
   * 根据搜索条件和分页查找数据
   * @param {Background_taskSearch} search 搜索条件
   * @memberof Background_taskDao
   */
  async findAll(
    search?: Background_taskSearch,
    pageModel?: PageModel,
  ) {
    const t = this;
    
    const table = "background_task";
    const method = "findAll";
    
    const [ beforeEvent ] = await t.eventEmitter2.emitAsync(`dao.before.sql.${ method }.${ table }`, { search });
    if (beforeEvent?.isReturn) return <typeof result>beforeEvent.data;
    
    const context = useContext();
    const args = [ ];
    let sql = `
      select t.*
      from
        ${ t.getFromQuery() }
      where
        ${ t.getWhereQuery(args, search) }
      group by t.id
    `;
    if (!search) {
      search = { };
    }
    if (!search.orderBy) {
      search.orderBy = "begin_time";
      search.orderDec = "descending";
    }
    if (search.orderBy) {
      sql += ` order by ${ context.escapeId(search.orderBy) } ${ context.escapeDec(search.orderDec) }`;
    }
    if (pageModel?.pgSize) {
      sql += ` limit ${ Number(pageModel?.pgOffset) || 0 },${ Number(pageModel.pgSize) }`;
    }
    
    let result = await context.query<Background_taskModel>(sql, args);
    for (let i = 0; i < result.length; i++) {
      const model = result[i];
      // 状态
      let _state = "";
      if (model.state === "running") {
        _state = "运行中";
      } else if (model.state === "success") {
        _state = "成功";
      } else if (model.state === "fail") {
        _state = "失败";
      } else if (model.state === "cancel") {
        _state = "取消";
      } else {
        _state = String(model.state);
      }
      model._state = _state;
      // 类型
      let _type = "";
      if (model.type === "text") {
        _type = "文本";
      } else if (model.type === "download") {
        _type = "下载";
      } else if (model.type === "inline") {
        _type = "查看";
      } else if (model.type === "tag") {
        _type = "标签";
      } else {
        _type = String(model.type);
      }
      model._type = _type;
    }
    
    const [ afterEvent ] = await t.eventEmitter2.emitAsync(`dao.after.sql.${ method }.${ table }`, { search, result });
    if (afterEvent?.isReturn) return <typeof result>afterEvent.data;
    
    return result;
  }
  
  /**
   * 获得表的唯一字段名列表
   * @return {{ uniqueKeys: string[]; uniqueComments: { [key: string]: string }; }}
   * @memberof Background_taskDao
   */
  getUniqueKeys(
  ): {
    uniqueKeys: string[];
    uniqueComments: { [key: string]: string };
    } {
    const uniqueKeys = [
    ];
    const uniqueComments = {
    };
    return { uniqueKeys, uniqueComments };
  }
  
  /**
   * 通过唯一约束获得一行数据
   * @param {Background_taskSearch} search0
   * @memberof Background_taskDao
   */
  async findByUnique(
    search0: Background_taskSearch | Background_taskModel,
  ) {
    const t = this;
    const { uniqueKeys } = t.getUniqueKeys();
    if (!uniqueKeys || uniqueKeys.length === 0) return;
    const search: Background_taskSearch = { };
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
   * @param {Background_taskModel} oldModel
   * @param {Background_taskModel} model
   * @return {boolean}
   * @memberof Background_taskDao
   */
  equalsByUnique(
    oldModel: Background_taskModel,
    model: Background_taskModel,
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
   * @param {Background_taskModel} model
   * @param {Background_taskModel} oldModel
   * @param {("ignore" | "throw" | "update")} uniqueType
   * @return {Promise<ResultSetHeader>}
   * @memberof Background_taskDao
   */
  async checkByUnique(
    model: Background_taskModel,
    oldModel: Background_taskModel,
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
        const resultSetHeader = await t.updateById(oldModel.id, { ...model, id: undefined });
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
   * @param {Background_taskSearch} search?
   * @return {Promise<Background_taskModel>} 
   * @memberof Background_taskDao
   */
  async findOne(
    search?: Background_taskSearch,
  ): Promise<Background_taskModel> {
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
   * @return {Promise<Background_taskModel>}
   * @memberof Background_taskDao
   */
  async findById(
    id: string,
  ): Promise<Background_taskModel> {
    const t = this;
    if (!id) return;
    const model = await t.findOne({ id });
    return model;
  }
  
  /**
   * 根据搜索条件判断数据是否存在
   * @param {Background_taskSearch} search?
   * @return {Promise<boolean>} 
   * @memberof Background_taskDao
   */
  async exist(
    search?: Background_taskSearch,
  ): Promise<boolean> {
    const t = this;
    const model = await t.findOne(search);
    const exist = !!model;
    return exist;
  }
  
  /**
   * 根据id判断数据是否存在
   * @param {string} id
   * @memberof Background_taskDao
   */
  async existById(
    id: string,
  ): Promise<boolean> {
    const t = this;
    const table = "background_task";
    const method = "existById";
    
    const [ beforeEvent ] = await t.eventEmitter2.emitAsync(`dao.before.sql.${ method }.${ table }`, { id });
    if (beforeEvent?.isReturn) return beforeEvent.data;
    
    if (!id) {
      return false;
    }
    
    const context = useContext();
    let sql = `
      select 1 e from background_task where id = ? limit 1
    `;
    let args = [ id ];
    
    interface Result {
      e: number,
    }
    let model = await context.queryOne<Result>(sql, args);
    let result = model?.e === 1;
    
    const [ afterEvent ] = await t.eventEmitter2.emitAsync(`dao.after.sql.${ method }.${ table }`, { id, result });
    if (afterEvent?.isReturn) return afterEvent.data;
    
    return result;
  }
  
  /**
   * 创建数据
   * @param {Background_taskModel} model
   * @param {({
   *   uniqueType?: "ignore" | "throw" | "update",
   * })} options? 唯一约束冲突时的处理选项, 默认为 throw,
   *   ignore: 忽略冲突
   *   throw: 抛出异常
   *   update: 更新冲突数据
   * @return {Promise<ResultSetHeader>} 
   * @memberof Background_taskDao
   */
  async create(
    model: Background_taskModel,
    options?: {
      uniqueType?: "ignore" | "throw" | "update",
    },
  ): Promise<ResultSetHeader> {
    const t = this;
    if (!model) {
      return;
    }
    const table = "background_task";
    const method = "create";
    
    const [ beforeEvent ] = await t.eventEmitter2.emitAsync(`dao.before.sql.${ method }.${ table }`, { model });
    if (beforeEvent?.isReturn) return beforeEvent.data;
    
    const context = useContext();
    
    // 状态
    if (!isEmpty(model._state) && model.state === undefined) {
      model._state = String(model._state).trim();
      if (model._state === "运行中") {
        model.state = "running";
      } else if (model._state === "成功") {
        model.state = "success";
      } else if (model._state === "失败") {
        model.state = "fail";
      } else if (model._state === "取消") {
        model.state = "cancel";
      }
    }
    
    // 类型
    if (!isEmpty(model._type) && model.type === undefined) {
      model._type = String(model._type).trim();
      if (model._type === "文本") {
        model.type = "text";
      } else if (model._type === "下载") {
        model.type = "download";
      } else if (model._type === "查看") {
        model.type = "inline";
      } else if (model._type === "标签") {
        model.type = "tag";
      }
    }
    
    const oldModel = await t.findByUnique(model);
    const resultSetHeader = await t.checkByUnique(model, oldModel, options?.uniqueType);
    if (resultSetHeader) {
      return resultSetHeader;
    }
    
    const args = [ ];
    let sql = `
      insert into background_task(
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
    if (model.state !== undefined) {
      sql += `,state`;
    }
    if (model.type !== undefined) {
      sql += `,type`;
    }
    if (model.result !== undefined) {
      sql += `,result`;
    }
    if (model.err_msg !== undefined) {
      sql += `,err_msg`;
    }
    if (model.begin_time !== undefined) {
      sql += `,begin_time`;
    }
    if (model.end_time !== undefined) {
      sql += `,end_time`;
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
    if (model.state !== undefined) {
      sql += `,?`;
      args.push(model.state);
    }
    if (model.type !== undefined) {
      sql += `,?`;
      args.push(model.type);
    }
    if (model.result !== undefined) {
      sql += `,?`;
      args.push(model.result);
    }
    if (model.err_msg !== undefined) {
      sql += `,?`;
      args.push(model.err_msg);
    }
    if (model.begin_time !== undefined) {
      sql += `,?`;
      args.push(model.begin_time);
    }
    if (model.end_time !== undefined) {
      sql += `,?`;
      args.push(model.end_time);
    }
    if (model.rem !== undefined) {
      sql += `,?`;
      args.push(model.rem);
    }
    sql += `)`;
    
    let result = await context.execute(sql, args);
    
    const [ afterEvent ] = await t.eventEmitter2.emitAsync(`dao.after.sql.${ method }.${ table }`, { model, result });
    if (afterEvent?.isReturn) return afterEvent.data;
    
    return result;
  }
  
  /**
   * 根据id修改一行数据
   * @param {string} id
   * @param {Background_taskModel} model
   * @param {({
   *   uniqueType?: "ignore" | "throw" | "update",
   * })} options? 唯一约束冲突时的处理选项, 默认为 throw,
   *   ignore: 忽略冲突
   *   throw: 抛出异常
   *   create: 级联插入新数据
   * @return {Promise<ResultSetHeader>}
   * @memberof Background_taskDao
   */
  async updateById(
    id: string,
    model: Background_taskModel,
    options?: {
      uniqueType?: "ignore" | "throw" | "create",
    },
  ): Promise<ResultSetHeader> {
    const t = this;
    
    const table = "background_task";
    const method = "updateById";
    
    const [ beforeEvent ] = await t.eventEmitter2.emitAsync(`dao.before.sql.${ method }.${ table }`, { id, model });
    if (beforeEvent?.isReturn) return beforeEvent.data;
    
    if (!id || !model) {
      return;
    }
    const context = useContext();
    
    // 状态
    if (!isEmpty(model._state) && model.state === undefined) {
      model._state = String(model._state).trim();
      if (model._state === "运行中") {
        model.state = "running";
      } else if (model._state === "成功") {
        model.state = "success";
      } else if (model._state === "失败") {
        model.state = "fail";
      } else if (model._state === "取消") {
        model.state = "cancel";
      }
    }
    
    // 类型
    if (!isEmpty(model._type) && model.type === undefined) {
      model._type = String(model._type).trim();
      if (model._type === "文本") {
        model.type = "text";
      } else if (model._type === "下载") {
        model.type = "download";
      } else if (model._type === "查看") {
        model.type = "inline";
      } else if (model._type === "标签") {
        model.type = "tag";
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
    
    const args = [ ];
    let sql = `
      update background_task set update_time = ?
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
    if (model.state !== undefined) {
      if (model.state != oldModel?.state) {
        sql += `,state = ?`;
        args.push(model.state);
      }
    }
    if (model.type !== undefined) {
      if (model.type != oldModel?.type) {
        sql += `,type = ?`;
        args.push(model.type);
      }
    }
    if (model.result !== undefined) {
      if (model.result != oldModel?.result) {
        sql += `,result = ?`;
        args.push(model.result);
      }
    }
    if (model.err_msg !== undefined) {
      if (model.err_msg != oldModel?.err_msg) {
        sql += `,err_msg = ?`;
        args.push(model.err_msg);
      }
    }
    if (model.begin_time !== undefined) {
      if (model.begin_time != oldModel?.begin_time) {
        sql += `,begin_time = ?`;
        args.push(model.begin_time);
      }
    }
    if (model.end_time !== undefined) {
      if (model.end_time != oldModel?.end_time) {
        sql += `,end_time = ?`;
        args.push(model.end_time);
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
    
    const [ afterEvent ] = await t.eventEmitter2.emitAsync(`dao.after.sql.${ method }.${ table }`, { id, model, result });
    if (afterEvent?.isReturn) return afterEvent.data;
    
    return result;
  }
  
  /**
   * 根据 ids 删除数据
   * @param {string[]} ids
   * @return {Promise<number>}
   * @memberof Background_taskDao
   */
  async deleteByIds(
    ids: string[],
  ): Promise<number> {
    const t = this;
    
    const table = "background_task";
    const method = "deleteByIds";
    
    const [ beforeEvent ] = await t.eventEmitter2.emitAsync(`dao.before.sql.${ method }.${ table }`, { ids });
    if (beforeEvent?.isReturn) return beforeEvent.data;
    
    if (!ids || !ids.length) {
      return 0;
    }
    
    const context = useContext();
    
    let num = 0;
    let sql = `
      update background_task set is_deleted = 1,delete_time = ? where id = ? limit 1
    `;
    for (let i = 0; i < ids.length; i++) {
      const id = ids[i];
      const args = [ context.getReqDate(), id ];
      const result = await context.execute(sql, args);
      num += result.affectedRows;
    }
    
    const [ afterEvent ] = await t.eventEmitter2.emitAsync(`dao.after.sql.${ method }.${ table }`, { ids, num });
    if (afterEvent?.isReturn) return afterEvent.data;
    
    return num;
  }
  
  
  /**
   * 根据 ids 还原数据
   * @param {string[]} ids
   * @return {Promise<number>}
   * @memberof Background_taskDao
   */
  async revertByIds(
    ids: string[],
  ): Promise<number> {
    const t = this;
    
    const table = "background_task";
    const method = "create";
    
    const [ beforeEvent ] = await t.eventEmitter2.emitAsync(`dao.before.sql.${ method }.${ table }`, { ids });
    if (beforeEvent?.isReturn) return beforeEvent.data;
    
    if (!ids || !ids.length) {
      return 0;
    }
    
    const context = useContext();
    
    let num = 0;
    let sql = `
      update background_task set is_deleted = 0 where id = ? limit 1
    `;
    for (let i = 0; i < ids.length; i++) {
      const id = ids[i];
      const args = [ id ];
      const result = await context.execute(sql, args);
      num += result.affectedRows;
    }
    
    const [ afterEvent ] = await t.eventEmitter2.emitAsync(`dao.after.sql.${ method }.${ table }`, { ids, num });
    if (afterEvent?.isReturn) return afterEvent.data;
    
    return num;
  }
  
}
