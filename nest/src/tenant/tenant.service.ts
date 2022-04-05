import { ResultSetHeader } from "mysql2/promise";
import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { shortUuidV4 } from "../common/util/uuid";
import { readFile } from "fs/promises";
import { renderExcelWorker } from "../common/util/ejsexcel_worker";
import { renderExcel } from "ejsexcel";
import { MinioDao } from "../common/minio/minio.dao";
import { ServiceException } from '../common/exceptions/service.exception';
import { PageModel } from '../common/page.model';
import { TenantModel, TenantSearch } from './tenant.model';
import { TenantDao } from "./tenant.dao";

@Injectable()
export class TenantService {
  
  constructor(
    private readonly eventEmitter2: EventEmitter2,
    private readonly minioDao: MinioDao,
    private readonly tenantDao: TenantDao,
  ) { }
  
  /**
   * 根据条件查找总数据数
   * @param {TenantSearch} search 搜索条件
   * @return {Promise<number>}
   * @memberof TenantService
   */
  async findCount(
    search?: TenantSearch,
  ): Promise<number> {
    const t = this;
    const table = "tenant";
    const method = "findCount";
    
    const [ beforeEvent ] = await t.eventEmitter2.emitAsync(`service.before.${ method }.${ table }`, { search });
    if (beforeEvent?.isReturn) return beforeEvent.data;
    
    let result = await t.tenantDao.findCount(search);
    
    const [ afterEvent ] = await t.eventEmitter2.emitAsync(`service.after.${ method }.${ table }`, { search, result });
    if (afterEvent?.isReturn) return afterEvent.data;
    
    return result;
  }
  
  /**
   * 根据条件和分页查找数据
   * @param {TenantSearch} search 搜索条件
   * @param {PageModel} pageModel 分页条件
   * @return {Promise<TenantModel[]>} 
   * @memberof TenantService
   */
  async findAll(
    search?: TenantSearch,
    pageModel?: PageModel,
  ): Promise<TenantModel[]> {
    const t = this;
    const table = "tenant";
    const method = "findAll";
    
    const [ beforeEvent ] = await t.eventEmitter2.emitAsync(`service.before.${ method }.${ table }`, { search });
    if (beforeEvent?.isReturn) return beforeEvent.data;
    
    let result: TenantModel[] = await t.tenantDao.findAll(search, pageModel);
    
    const [ afterEvent ] = await t.eventEmitter2.emitAsync(`service.after.${ method }.${ table }`, { search, result });
    if (afterEvent?.isReturn) return afterEvent.data;
    
    return result;
  }
  
  /**
   * 根据条件查找第一条数据
   * @param {TenantSearch} search 搜索条件
   * @return {Promise<TenantModel>} 
   * @memberof TenantService
   */
  async findOne(
    search?: TenantSearch,
  ): Promise<TenantModel> {
    const t = this;
    const data = await t.tenantDao.findOne(search);
    return data;
  }
  
  /**
   * 根据id查找数据
   * @param {string} id
   * @return {Promise<TenantModel>}
   * @memberof TenantService
   */
  async findById(
    id: string,
  ): Promise<TenantModel> {
    const t = this;
    if (!id) return;
    const data = await t.tenantDao.findById(id);
    return data;
  }
  
  /**
   * 根据搜索条件判断数据是否存在
   * @param {TenantSearch} search 搜索条件
   * @return {Promise<boolean>}
   * @memberof TenantService
   */
  async exist(
    search?: TenantSearch,
  ): Promise<boolean> {
    const t = this;
    const data = await t.tenantDao.exist(search);
    return data;
  }
  
  /**
   * 根据id查找数据是否存在
   * @param {string} id
   * @return {Promise<boolean>}
   * @memberof TenantService
   */
  async existById(
    id: string,
  ): Promise<boolean> {
    const t = this;
    if (!id) return;
    const data = await t.tenantDao.existById(id);
    return data;
  }
  
  /**
   * 创建数据
   * @param {TenantModel} model
   * @return {Promise<string>} 
   * @memberof TenantService
   */
  async create(
    model: TenantModel,
  ): Promise<string> {
    const t = this;
    const table = "tenant";
    const method = "create";
    
    const [ beforeEvent ] = await t.eventEmitter2.emitAsync(`service.before.${ method }.${ table }`, { model });
    if (beforeEvent?.isReturn) return beforeEvent.data;
    
    model.id = shortUuidV4();
    let result: ResultSetHeader = await t.tenantDao.create(model);
    
    const [ afterEvent ] = await t.eventEmitter2.emitAsync(`service.after.${ method }.${ table }`, { model, result });
    if (afterEvent?.isReturn) return afterEvent.data;
    
    return model.id;
  }
  
  /**
   * 根据id修改数据
   * @param {string} id
   * @param {TenantModel} model
   * @return {Promise<string>}
   * @memberof TenantService
   */
  async updateById(
    id: string,
    model: TenantModel,
  ): Promise<string> {
    const t = this;
    const table = "tenant";
    const method = "updateById";
    
    const [ beforeEvent ] = await t.eventEmitter2.emitAsync(`service.before.${ method }.${ table }`, { model, id });
    if (beforeEvent?.isReturn) return beforeEvent.data;
    
    if (!id) {
      throw "updateById id can not be empty!";
    }
    if (process.env.NODE_ENV === "production") {
      await t.findById(id);
    }
    let result: ResultSetHeader = await t.tenantDao.updateById(id, model);
    
    const [ afterEvent ] = await t.eventEmitter2.emitAsync(`service.after.${ method }.${ table }`, { model, id, result });
    if (afterEvent?.isReturn) return afterEvent.data;
    
    return id;
  }
  
  /**
   * 根据id列表删除数据
   * @param {string[]} ids
   * @return {Promise<number>}
   * @memberof TenantService
   */
  async deleteByIds(
    ids: string[],
  ): Promise<number> {
    const t = this;
    const table = "tenant";
    const method = "deleteByIds";
    
    const [ beforeEvent ] = await t.eventEmitter2.emitAsync(`service.before.${ method }.${ table }`, { ids });
    if (beforeEvent?.isReturn) return beforeEvent.data;
    
    let num = await t.tenantDao.deleteByIds(ids);
    
    const [ afterEvent ] = await t.eventEmitter2.emitAsync(`service.after.${ method }.${ table }`, { ids, num });
    if (afterEvent?.isReturn) return afterEvent.data;
    
    return num;
  }
  
  /**
   * 根据id列表还原数据
   * @param {string[]} ids
   * @return {Promise<number>}
   * @memberof TenantService
   */
  async revertByIds(
    ids: string[],
  ): Promise<number> {
    const t = this;
    const table = "tenant";
    const method = "revertByIds";
    
    const [ beforeEvent ] = await t.eventEmitter2.emitAsync(`service.before.${ method }.${ table }`, { ids });
    if (beforeEvent?.isReturn) return beforeEvent.data;
    
    let num = await t.tenantDao.revertByIds(ids);
    
    const [ afterEvent ] = await t.eventEmitter2.emitAsync(`service.after.${ method }.${ table }`, { ids, num });
    if (afterEvent?.isReturn) return afterEvent.data;
    
    return num;
  }
  
  /**
   * 导出Excel
   * @param {TenantSearch} search 搜索条件
   * @return {Promise<String>}
   * @memberof <%=tableUp%>Service
   */
  async exportExcel(
    search?: TenantSearch,
  ): Promise<String> {
    const t = this;
    const table = "tenant";
    const method = "exportExcel";
    
    const [ beforeEvent ] = await t.eventEmitter2.emitAsync(`service.before.${ method }.${ table }`, { search });
    if (beforeEvent?.isReturn) return beforeEvent.data;
    
    const models = await t.findAll(search);
    const buffer0 = await readFile(`${ __dirname }/tenant.xlsx`);
    let buffer: Buffer;
    if (models.length > 1000) {
      buffer = await renderExcelWorker(buffer0, { models });
    } else {
      buffer = await renderExcel(buffer0, { models });
    }
    
    let reslut = await t.minioDao.upload({
      data: buffer,
      filename: "租户.xlsx",
      mimetype: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    
    const [ afterEvent ] = await t.eventEmitter2.emitAsync(`service.after.${ method }.${ table }`, { search, buffer });
    if (afterEvent?.isReturn) return afterEvent.data;
    
    return reslut;
  }
  
  /**
   * 查找order_by字段的最大值
   * @return {Promise<number>}
   * @memberof TenantService
   */
  async findLastOrderBy(): Promise<number> {
    const t = this;
    const table = "tenant";
    const method = "findLastOrderBy";
    
    const [ beforeEvent ] = await t.eventEmitter2.emitAsync(`service.before.${ method }.${ table }`, { });
    if (beforeEvent?.isReturn) return beforeEvent.data;
    
    let result = await t.tenantDao.findLastOrderBy();
    
    const [ afterEvent ] = await t.eventEmitter2.emitAsync(`service.after.${ method }.${ table }`, { result });
    if (afterEvent?.isReturn) return afterEvent.data;
    
    return result;
  }
  
}
