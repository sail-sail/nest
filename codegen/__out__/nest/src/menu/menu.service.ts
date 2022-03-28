import { ResultSetHeader } from "mysql2/promise";
import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { shortUuidV4 } from "../common/util/uuid";
import { readFile } from "fs/promises";
import { renderExcelWorker } from "../common/util/ejsexcel_worker";
import { renderExcel } from "ejsexcel";
import { ServiceException } from '../common/exceptions/service.exception';
import { PageModel } from '../common/page.model';
import { MenuModel, MenuSearch } from './menu.model';
import { MenuDao } from "./menu.dao";

@Injectable()
export class MenuService {
  
  constructor(
    private readonly eventEmitter2: EventEmitter2,
    private readonly menuDao: MenuDao,
  ) { }
  
  /**
   * 根据条件查找总数据数
   * @param {MenuSearch} search 搜索条件
   * @return {Promise<number>}
   * @memberof MenuService
   */
  async findCount(
    search?: MenuSearch,
  ): Promise<number> {
    const t = this;
    const table = "menu";
    const method = "findCount";
    
    const [ beforeEvent ] = await t.eventEmitter2.emitAsync(`service.before.${ method }.${ table }`, { search });
    if (beforeEvent?.isReturn) return beforeEvent.data;
    
    let result = await t.menuDao.findCount(search);
    
    const [ afterEvent ] = await t.eventEmitter2.emitAsync(`service.after.${ method }.${ table }`, { search, result });
    if (afterEvent?.isReturn) return afterEvent.data;
    
    return result;
  }
  
  /**
   * 根据条件和分页查找数据
   * @param {MenuSearch} search 搜索条件
   * @param {PageModel} pageModel 分页条件
   * @return {Promise<MenuModel[]>} 
   * @memberof MenuService
   */
  async findAll(
    search?: MenuSearch,
    pageModel?: PageModel,
  ): Promise<MenuModel[]> {
    const t = this;
    const table = "menu";
    const method = "findAll";
    
    const [ beforeEvent ] = await t.eventEmitter2.emitAsync(`service.before.${ method }.${ table }`, { search });
    if (beforeEvent?.isReturn) return beforeEvent.data;
    
    let result: MenuModel[] = await t.menuDao.findAll(search, pageModel);
    
    const [ afterEvent ] = await t.eventEmitter2.emitAsync(`service.after.${ method }.${ table }`, { search, result });
    if (afterEvent?.isReturn) return afterEvent.data;
    
    return result;
  }
  
  /**
   * 根据条件查找第一条数据
   * @param {MenuSearch} search 搜索条件
   * @return {Promise<MenuModel>} 
   * @memberof MenuService
   */
  async findOne(
    search?: MenuSearch,
  ): Promise<MenuModel> {
    const t = this;
    const data = await t.menuDao.findOne(search);
    return data;
  }
  
  /**
   * 根据id查找数据
   * @param {string} id
   * @return {Promise<MenuModel>}
   * @memberof MenuService
   */
  async findById(
    id: string,
  ): Promise<MenuModel> {
    const t = this;
    if (!id) return;
    const data = await t.menuDao.findById(id);
    return data;
  }
  
  /**
   * 根据搜索条件判断数据是否存在
   * @param {MenuSearch} search 搜索条件
   * @return {Promise<boolean>}
   * @memberof MenuService
   */
  async exist(
    search?: MenuSearch,
  ): Promise<boolean> {
    const t = this;
    const data = await t.menuDao.exist(search);
    return data;
  }
  
  /**
   * 根据id查找数据是否存在
   * @param {string} id
   * @return {Promise<boolean>}
   * @memberof MenuService
   */
  async existById(
    id: string,
  ): Promise<boolean> {
    const t = this;
    if (!id) return;
    const data = await t.menuDao.existById(id);
    return data;
  }
  
  /**
   * 创建数据
   * @param {MenuModel} model
   * @return {Promise<string>} 
   * @memberof MenuService
   */
  async create(
    model: MenuModel,
  ): Promise<string> {
    const t = this;
    const table = "menu";
    const method = "create";
    
    const [ beforeEvent ] = await t.eventEmitter2.emitAsync(`service.before.${ method }.${ table }`, { model });
    if (beforeEvent?.isReturn) return beforeEvent.data;
    
    model.id = shortUuidV4();
    let result: ResultSetHeader = await t.menuDao.create(model);
    
    const [ afterEvent ] = await t.eventEmitter2.emitAsync(`service.after.${ method }.${ table }`, { model, result });
    if (afterEvent?.isReturn) return afterEvent.data;
    
    return model.id;
  }
  
  /**
   * 根据id修改数据
   * @param {string} id
   * @param {MenuModel} model
   * @return {Promise<string>}
   * @memberof MenuService
   */
  async updateById(
    id: string,
    model: MenuModel,
  ): Promise<string> {
    const t = this;
    const table = "menu";
    const method = "updateById";
    
    const [ beforeEvent ] = await t.eventEmitter2.emitAsync(`service.before.${ method }.${ table }`, { model, id });
    if (beforeEvent?.isReturn) return beforeEvent.data;
    
    if (!id) {
      throw "updateById id can not be empty!";
    }
    if (process.env.NODE_ENV === "production") {
      await t.findById(id);
    }
    let result: ResultSetHeader = await t.menuDao.updateById(id, model);
    
    const [ afterEvent ] = await t.eventEmitter2.emitAsync(`service.after.${ method }.${ table }`, { model, id, result });
    if (afterEvent?.isReturn) return afterEvent.data;
    
    return id;
  }
  
  /**
   * 根据id列表删除数据
   * @param {string[]} ids
   * @return {Promise<number>}
   * @memberof MenuService
   */
  async deleteByIds(
    ids: string[],
  ): Promise<number> {
    const t = this;
    const table = "menu";
    const method = "deleteByIds";
    
    const [ beforeEvent ] = await t.eventEmitter2.emitAsync(`service.before.${ method }.${ table }`, { ids });
    if (beforeEvent?.isReturn) return beforeEvent.data;
    
    let num = await t.menuDao.deleteByIds(ids);
    
    const [ afterEvent ] = await t.eventEmitter2.emitAsync(`service.after.${ method }.${ table }`, { ids, num });
    if (afterEvent?.isReturn) return afterEvent.data;
    
    return num;
  }
  
  /**
   * 根据id列表还原数据
   * @param {string[]} ids
   * @return {Promise<number>}
   * @memberof MenuService
   */
  async revertByIds(
    ids: string[],
  ): Promise<number> {
    const t = this;
    const table = "menu";
    const method = "revertByIds";
    
    const [ beforeEvent ] = await t.eventEmitter2.emitAsync(`service.before.${ method }.${ table }`, { ids });
    if (beforeEvent?.isReturn) return beforeEvent.data;
    
    let num = await t.menuDao.revertByIds(ids);
    
    const [ afterEvent ] = await t.eventEmitter2.emitAsync(`service.after.${ method }.${ table }`, { ids, num });
    if (afterEvent?.isReturn) return afterEvent.data;
    
    return num;
  }
  
  /**
   * 导出Excel
   * @param {MenuSearch} search 搜索条件
   * @return {Promise<Buffer>}
   * @memberof <%=tableUp%>Service
   */
  async exportExcel(
    search?: MenuSearch,
  ): Promise<Buffer> {
    const t = this;
    const table = "menu";
    const method = "exportExcel";
    
    const [ beforeEvent ] = await t.eventEmitter2.emitAsync(`service.before.${ method }.${ table }`, { search });
    if (beforeEvent?.isReturn) return beforeEvent.data;
    
    const models = await t.findAll(search);
    const buffer0 = await readFile(`${ __dirname }/menu.xlsx`);
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
  
  /**
   * 查找order_by字段的最大值
   * @return {Promise<number>}
   * @memberof MenuService
   */
  async findLastOrderBy(): Promise<number> {
    const t = this;
    const table = "menu";
    const method = "findLastOrderBy";
    
    const [ beforeEvent ] = await t.eventEmitter2.emitAsync(`service.before.${ method }.${ table }`, { });
    if (beforeEvent?.isReturn) return beforeEvent.data;
    
    let result = await t.menuDao.findLastOrderBy();
    
    const [ afterEvent ] = await t.eventEmitter2.emitAsync(`service.after.${ method }.${ table }`, { result });
    if (afterEvent?.isReturn) return afterEvent.data;
    
    return result;
  }
  
}
