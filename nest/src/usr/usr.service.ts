import { ResultSetHeader } from "mysql2/promise";
import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { shortUuidV4 } from "../common/util/uuid";
import { readFile } from "fs/promises";
import { renderExcelWorker } from "../common/util/ejsexcel_worker";
import { renderExcel } from "ejsexcel";
import { ServiceException } from '../common/exceptions/service.exception';
import { PageModel } from '../common/page.model';
import { UsrModel, UsrSearch } from './usr.model';
import { UsrDao } from "./usr.dao";
import { AuthService } from "../common/auth/auth.service";

@Injectable()
export class UsrService {
  
  constructor(
    private readonly eventEmitter2: EventEmitter2,
    private readonly usrDao: UsrDao,
    private readonly authService: AuthService,
  ) { }
  
  /**
   * 根据条件查找总数据数
   * @param {UsrSearch} search 搜索条件
   * @return {Promise<number>}
   * @memberof UsrService
   */
  async findCount(
    search?: UsrSearch,
  ): Promise<number> {
    const t = this;
    const table = "usr";
    const method = "findCount";
    
    const [ beforeEvent ] = await t.eventEmitter2.emitAsync(`service.before.${ method }.${ table }`, { search });
    if (beforeEvent?.isReturn) return beforeEvent.data;
    
    let result = await t.usrDao.findCount(search);
    
    const [ afterEvent ] = await t.eventEmitter2.emitAsync(`service.after.${ method }.${ table }`, { search, result });
    if (afterEvent?.isReturn) return afterEvent.data;
    
    return result;
  }
  
  /**
   * 根据条件和分页查找数据
   * @param {UsrSearch} search 搜索条件
   * @param {PageModel} pageModel 分页条件
   * @return {Promise<UsrModel[]>} 
   * @memberof UsrService
   */
  async findAll(
    search?: UsrSearch,
    pageModel?: PageModel,
  ): Promise<UsrModel[]> {
    const t = this;
    const table = "usr";
    const method = "findAll";
    
    const [ beforeEvent ] = await t.eventEmitter2.emitAsync(`service.before.${ method }.${ table }`, { search });
    if (beforeEvent?.isReturn) return beforeEvent.data;
    
    let result: UsrModel[] = await t.usrDao.findAll(search, pageModel);
    
    const [ afterEvent ] = await t.eventEmitter2.emitAsync(`service.after.${ method }.${ table }`, { search, result });
    if (afterEvent?.isReturn) return afterEvent.data;
    
    return result;
  }
  
  /**
   * 根据条件查找第一条数据
   * @param {UsrSearch} search 搜索条件
   * @return {Promise<UsrModel>} 
   * @memberof UsrService
   */
  async findOne(
    search?: UsrSearch,
  ): Promise<UsrModel> {
    const t = this;
    const data = await t.usrDao.findOne(search);
    return data;
  }
  
  /**
   * 根据id查找数据
   * @param {string} id
   * @return {Promise<UsrModel>}
   * @memberof UsrService
   */
  async findById(
    id: string,
  ): Promise<UsrModel> {
    const t = this;
    if (!id) return;
    const data = await t.usrDao.findById(id);
    return data;
  }
  
  /**
   * 根据搜索条件判断数据是否存在
   * @param {UsrSearch} search 搜索条件
   * @return {Promise<boolean>}
   * @memberof UsrService
   */
  async exist(
    search?: UsrSearch,
  ): Promise<boolean> {
    const t = this;
    const data = await t.usrDao.exist(search);
    return data;
  }
  
  /**
   * 根据id查找数据是否存在
   * @param {string} id
   * @return {Promise<boolean>}
   * @memberof UsrService
   */
  async existById(
    id: string,
  ): Promise<boolean> {
    const t = this;
    if (!id) return;
    const data = await t.usrDao.existById(id);
    return data;
  }
  
  /**
   * 创建数据
   * @param {UsrModel} model
   * @return {Promise<string>} 
   * @memberof UsrService
   */
  async create(
    model: UsrModel,
  ): Promise<string> {
    const t = this;
    const table = "usr";
    const method = "create";
    
    const [ beforeEvent ] = await t.eventEmitter2.emitAsync(`service.before.${ method }.${ table }`, { model });
    if (beforeEvent?.isReturn) return beforeEvent.data;
    
    // 密码
    if (model.password) {
      model.password = t.authService.getPassword(model.password);
    }
    model.id = shortUuidV4();
    let result: ResultSetHeader = await t.usrDao.create(model);
    
    const [ afterEvent ] = await t.eventEmitter2.emitAsync(`service.after.${ method }.${ table }`, { model, result });
    if (afterEvent?.isReturn) return afterEvent.data;
    
    return model.id;
  }
  
  /**
   * 根据id修改数据
   * @param {string} id
   * @param {UsrModel} model
   * @return {Promise<string>}
   * @memberof UsrService
   */
  async updateById(
    id: string,
    model: UsrModel,
  ): Promise<string> {
    const t = this;
    const table = "usr";
    const method = "updateById";
    
    const [ beforeEvent ] = await t.eventEmitter2.emitAsync(`service.before.${ method }.${ table }`, { model, id });
    if (beforeEvent?.isReturn) return beforeEvent.data;
    
    if (!id) {
      throw "updateById id can not be empty!";
    }
    if (process.env.NODE_ENV === "production") {
      await t.findById(id);
    }
    // 密码
    if (model.password) {
      model.password = t.authService.getPassword(model.password);
    }
    let result: ResultSetHeader = await t.usrDao.updateById(id, model);
    
    const [ afterEvent ] = await t.eventEmitter2.emitAsync(`service.after.${ method }.${ table }`, { model, id, result });
    if (afterEvent?.isReturn) return afterEvent.data;
    
    return id;
  }
  
  /**
   * 根据id列表删除数据
   * @param {string[]} ids
   * @return {Promise<number>}
   * @memberof UsrService
   */
  async deleteByIds(
    ids: string[],
  ): Promise<number> {
    const t = this;
    const table = "usr";
    const method = "deleteByIds";
    
    const [ beforeEvent ] = await t.eventEmitter2.emitAsync(`service.before.${ method }.${ table }`, { ids });
    if (beforeEvent?.isReturn) return beforeEvent.data;
    
    let num = await t.usrDao.deleteByIds(ids);
    
    const [ afterEvent ] = await t.eventEmitter2.emitAsync(`service.after.${ method }.${ table }`, { ids, num });
    if (afterEvent?.isReturn) return afterEvent.data;
    
    return num;
  }
  
  /**
   * 根据id列表还原数据
   * @param {string[]} ids
   * @return {Promise<number>}
   * @memberof UsrService
   */
  async revertByIds(
    ids: string[],
  ): Promise<number> {
    const t = this;
    const table = "usr";
    const method = "revertByIds";
    
    const [ beforeEvent ] = await t.eventEmitter2.emitAsync(`service.before.${ method }.${ table }`, { ids });
    if (beforeEvent?.isReturn) return beforeEvent.data;
    
    let num = await t.usrDao.revertByIds(ids);
    
    const [ afterEvent ] = await t.eventEmitter2.emitAsync(`service.after.${ method }.${ table }`, { ids, num });
    if (afterEvent?.isReturn) return afterEvent.data;
    
    return num;
  }
  
  /**
   * 导出Excel
   * @param {UsrSearch} search 搜索条件
   * @return {Promise<Buffer>}
   * @memberof <%=tableUp%>Service
   */
  async exportExcel(
    search?: UsrSearch,
  ): Promise<Buffer> {
    const t = this;
    const table = "usr";
    const method = "exportExcel";
    
    const [ beforeEvent ] = await t.eventEmitter2.emitAsync(`service.before.${ method }.${ table }`, { search });
    if (beforeEvent?.isReturn) return beforeEvent.data;
    
    const models = await t.findAll(search);
    const buffer0 = await readFile(`${ __dirname }/usr.xlsx`);
    let buffer: Buffer;
    if (models.length > 1000) {
      buffer = await renderExcelWorker(buffer0, { models });
    } else {
      buffer = await renderExcel(buffer0, { models });
    }
    
    const [ afterEvent ] = await t.eventEmitter2.emitAsync(`service.after.${ method }.${ table }`, { search, buffer });
    if (afterEvent?.isReturn) return afterEvent.data;
    
    return buffer;
  }
  
}
