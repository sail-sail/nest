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
import { RoleModel, RoleSearch } from './role.model';
import { RoleDao } from "./role.dao";

@Injectable()
export class RoleService {
  
  constructor(
    private readonly eventEmitter2: EventEmitter2,
    private readonly minioDao: MinioDao,
    private readonly roleDao: RoleDao,
  ) { }
  
  /**
   * 根据条件查找总数据数
   * @param {RoleSearch} search 搜索条件
   * @return {Promise<number>}
   * @memberof RoleService
   */
  async findCount(
    search?: RoleSearch,
  ): Promise<number> {
    const t = this;
    const table = "role";
    const method = "findCount";
    
    const [ beforeEvent ] = await t.eventEmitter2.emitAsync(`service.before.${ method }.${ table }`, { search });
    if (beforeEvent?.isReturn) return beforeEvent.data;
    
    let result = await t.roleDao.findCount(search);
    
    const [ afterEvent ] = await t.eventEmitter2.emitAsync(`service.after.${ method }.${ table }`, { search, result });
    if (afterEvent?.isReturn) return afterEvent.data;
    
    return result;
  }
  
  /**
   * 根据条件和分页查找数据
   * @param {RoleSearch} search 搜索条件
   * @param {PageModel} pageModel 分页条件
   * @return {Promise<RoleModel[]>} 
   * @memberof RoleService
   */
  async findAll(
    search?: RoleSearch,
    pageModel?: PageModel,
  ): Promise<RoleModel[]> {
    const t = this;
    const table = "role";
    const method = "findAll";
    
    const [ beforeEvent ] = await t.eventEmitter2.emitAsync(`service.before.${ method }.${ table }`, { search });
    if (beforeEvent?.isReturn) return beforeEvent.data;
    
    let result: RoleModel[] = await t.roleDao.findAll(search, pageModel);
    
    const [ afterEvent ] = await t.eventEmitter2.emitAsync(`service.after.${ method }.${ table }`, { search, result });
    if (afterEvent?.isReturn) return afterEvent.data;
    
    return result;
  }
  
  /**
   * 根据条件查找第一条数据
   * @param {RoleSearch} search 搜索条件
   * @return {Promise<RoleModel>} 
   * @memberof RoleService
   */
  async findOne(
    search?: RoleSearch,
  ): Promise<RoleModel> {
    const t = this;
    const data = await t.roleDao.findOne(search);
    return data;
  }
  
  /**
   * 根据id查找数据
   * @param {string} id
   * @return {Promise<RoleModel>}
   * @memberof RoleService
   */
  async findById(
    id: string,
  ): Promise<RoleModel> {
    const t = this;
    if (!id) return;
    const data = await t.roleDao.findById(id);
    return data;
  }
  
  /**
   * 根据搜索条件判断数据是否存在
   * @param {RoleSearch} search 搜索条件
   * @return {Promise<boolean>}
   * @memberof RoleService
   */
  async exist(
    search?: RoleSearch,
  ): Promise<boolean> {
    const t = this;
    const data = await t.roleDao.exist(search);
    return data;
  }
  
  /**
   * 根据id查找数据是否存在
   * @param {string} id
   * @return {Promise<boolean>}
   * @memberof RoleService
   */
  async existById(
    id: string,
  ): Promise<boolean> {
    const t = this;
    if (!id) return;
    const data = await t.roleDao.existById(id);
    return data;
  }
  
  /**
   * 创建数据
   * @param {RoleModel} model
   * @return {Promise<string>} 
   * @memberof RoleService
   */
  async create(
    model: RoleModel,
  ): Promise<string> {
    const t = this;
    const table = "role";
    const method = "create";
    
    const [ beforeEvent ] = await t.eventEmitter2.emitAsync(`service.before.${ method }.${ table }`, { model });
    if (beforeEvent?.isReturn) return beforeEvent.data;
    
    model.id = shortUuidV4();
    let result: ResultSetHeader = await t.roleDao.create(model);
    
    const [ afterEvent ] = await t.eventEmitter2.emitAsync(`service.after.${ method }.${ table }`, { model, result });
    if (afterEvent?.isReturn) return afterEvent.data;
    
    return model.id;
  }
  
  /**
   * 根据id修改数据
   * @param {string} id
   * @param {RoleModel} model
   * @return {Promise<string>}
   * @memberof RoleService
   */
  async updateById(
    id: string,
    model: RoleModel,
  ): Promise<string> {
    const t = this;
    const table = "role";
    const method = "updateById";
    
    const [ beforeEvent ] = await t.eventEmitter2.emitAsync(`service.before.${ method }.${ table }`, { model, id });
    if (beforeEvent?.isReturn) return beforeEvent.data;
    
    if (!id) {
      throw "updateById id can not be empty!";
    }
    if (process.env.NODE_ENV === "production") {
      await t.findById(id);
    }
    let result: ResultSetHeader = await t.roleDao.updateById(id, model);
    
    const [ afterEvent ] = await t.eventEmitter2.emitAsync(`service.after.${ method }.${ table }`, { model, id, result });
    if (afterEvent?.isReturn) return afterEvent.data;
    
    return id;
  }
  
  /**
   * 根据id列表删除数据
   * @param {string[]} ids
   * @return {Promise<number>}
   * @memberof RoleService
   */
  async deleteByIds(
    ids: string[],
  ): Promise<number> {
    const t = this;
    const table = "role";
    const method = "deleteByIds";
    
    const [ beforeEvent ] = await t.eventEmitter2.emitAsync(`service.before.${ method }.${ table }`, { ids });
    if (beforeEvent?.isReturn) return beforeEvent.data;
    
    let num = await t.roleDao.deleteByIds(ids);
    
    const [ afterEvent ] = await t.eventEmitter2.emitAsync(`service.after.${ method }.${ table }`, { ids, num });
    if (afterEvent?.isReturn) return afterEvent.data;
    
    return num;
  }
  
  /**
   * 根据id列表还原数据
   * @param {string[]} ids
   * @return {Promise<number>}
   * @memberof RoleService
   */
  async revertByIds(
    ids: string[],
  ): Promise<number> {
    const t = this;
    const table = "role";
    const method = "revertByIds";
    
    const [ beforeEvent ] = await t.eventEmitter2.emitAsync(`service.before.${ method }.${ table }`, { ids });
    if (beforeEvent?.isReturn) return beforeEvent.data;
    
    let num = await t.roleDao.revertByIds(ids);
    
    const [ afterEvent ] = await t.eventEmitter2.emitAsync(`service.after.${ method }.${ table }`, { ids, num });
    if (afterEvent?.isReturn) return afterEvent.data;
    
    return num;
  }
  
  /**
   * 导出Excel
   * @param {RoleSearch} search 搜索条件
   * @return {Promise<String>}
   * @memberof <%=tableUp%>Service
   */
  async exportExcel(
    search?: RoleSearch,
  ): Promise<String> {
    const t = this;
    const table = "role";
    const method = "exportExcel";
    
    const [ beforeEvent ] = await t.eventEmitter2.emitAsync(`service.before.${ method }.${ table }`, { search });
    if (beforeEvent?.isReturn) return beforeEvent.data;
    
    const models = await t.findAll(search);
    const buffer0 = await readFile(`${ __dirname }/role.xlsx`);
    let buffer: Buffer;
    if (models.length > 1000) {
      buffer = await renderExcelWorker(buffer0, { models });
    } else {
      buffer = await renderExcel(buffer0, { models });
    }
    
    let reslut = await t.minioDao.upload({
      data: buffer,
      filename: "角色.xlsx",
      mimetype: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    
    const [ afterEvent ] = await t.eventEmitter2.emitAsync(`service.after.${ method }.${ table }`, { search, buffer });
    if (afterEvent?.isReturn) return afterEvent.data;
    
    return reslut;
  }
  
}
