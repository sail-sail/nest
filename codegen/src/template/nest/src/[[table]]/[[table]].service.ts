<#
const hasOrderBy = columns.some((column) => column.COLUMN_NAME === 'order_by');
#>import { ResultSetHeader } from "mysql2/promise";
import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { shortUuidV4 } from "../common/util/uuid";
import { readFile } from "fs/promises";
import { renderExcelWorker } from "../common/util/ejsexcel_worker";
import { renderExcel } from "ejsexcel";
import { ServiceException } from '../common/exceptions/service.exception';
import { PageModel } from '../common/page.model';
import { <#=tableUp#>Model, <#=tableUp#>Search } from './<#=table#>.model';
import { <#=tableUp#>Dao } from "./<#=table#>.dao";

@Injectable()
export class <#=tableUp#>Service {
  
  constructor(
    private readonly eventEmitter2: EventEmitter2,
    private readonly <#=table#>Dao: <#=tableUp#>Dao,
  ) { }
  
  /**
   * 根据条件查找总数据数
   * @param {<#=tableUp#>Search} search 搜索条件
   * @return {Promise<number>}
   * @memberof <#=tableUp#>Service
   */
  async findCount(
    search?: <#=tableUp#>Search,
  ): Promise<number> {
    const t = this;
    const table = "<#=table#>";
    const method = "findCount";
    
    const [ beforeEvent ] = await t.eventEmitter2.emitAsync(`service.before.${ method }.${ table }`, { search });
    if (beforeEvent?.isReturn) return beforeEvent.data;
    
    let result = await t.<#=table#>Dao.findCount(search);
    
    const [ afterEvent ] = await t.eventEmitter2.emitAsync(`service.after.${ method }.${ table }`, { search, result });
    if (afterEvent?.isReturn) return afterEvent.data;
    
    return result;
  }
  
  /**
   * 根据条件和分页查找数据
   * @param {<#=tableUp#>Search} search 搜索条件
   * @param {PageModel} pageModel 分页条件
   * @return {Promise<<#=tableUp#>Model[]>} 
   * @memberof <#=tableUp#>Service
   */
  async findAll(
    search?: <#=tableUp#>Search,
    pageModel?: PageModel,
  ): Promise<<#=tableUp#>Model[]> {
    const t = this;
    const table = "<#=table#>";
    const method = "findAll";
    
    const [ beforeEvent ] = await t.eventEmitter2.emitAsync(`service.before.${ method }.${ table }`, { search });
    if (beforeEvent?.isReturn) return beforeEvent.data;
    
    let result: <#=tableUp#>Model[] = await t.<#=table#>Dao.findAll(search, pageModel);
    
    const [ afterEvent ] = await t.eventEmitter2.emitAsync(`service.after.${ method }.${ table }`, { search, result });
    if (afterEvent?.isReturn) return afterEvent.data;
    
    return result;
  }
  
  /**
   * 根据条件查找第一条数据
   * @param {<#=tableUp#>Search} search 搜索条件
   * @return {Promise<<#=tableUp#>Model>} 
   * @memberof <#=tableUp#>Service
   */
  async findOne(
    search?: <#=tableUp#>Search,
  ): Promise<<#=tableUp#>Model> {
    const t = this;
    const data = await t.<#=table#>Dao.findOne(search);
    return data;
  }
  
  /**
   * 根据id查找数据
   * @param {string} id
   * @return {Promise<<#=tableUp#>Model>}
   * @memberof <#=tableUp#>Service
   */
  async findById(
    id: string,
  ): Promise<<#=tableUp#>Model> {
    const t = this;
    if (!id) return;
    const data = await t.<#=table#>Dao.findById(id);
    return data;
  }
  
  /**
   * 根据搜索条件判断数据是否存在
   * @param {<#=tableUp#>Search} search 搜索条件
   * @return {Promise<boolean>}
   * @memberof <#=tableUp#>Service
   */
  async exist(
    search?: <#=tableUp#>Search,
  ): Promise<boolean> {
    const t = this;
    const data = await t.<#=table#>Dao.exist(search);
    return data;
  }
  
  /**
   * 根据id查找数据是否存在
   * @param {string} id
   * @return {Promise<boolean>}
   * @memberof <#=tableUp#>Service
   */
  async existById(
    id: string,
  ): Promise<boolean> {
    const t = this;
    if (!id) return;
    const data = await t.<#=table#>Dao.existById(id);
    return data;
  }
  
  /**
   * 创建数据
   * @param {<#=tableUp#>Model} model
   * @return {Promise<string>} 
   * @memberof <#=tableUp#>Service
   */
  async create(
    model: <#=tableUp#>Model,
  ): Promise<string> {
    const t = this;
    const table = "<#=table#>";
    const method = "create";
    
    const [ beforeEvent ] = await t.eventEmitter2.emitAsync(`service.before.${ method }.${ table }`, { model });
    if (beforeEvent?.isReturn) return beforeEvent.data;
    
    model.id = shortUuidV4();
    let result: ResultSetHeader = await t.<#=table#>Dao.create(model);
    
    const [ afterEvent ] = await t.eventEmitter2.emitAsync(`service.after.${ method }.${ table }`, { model, result });
    if (afterEvent?.isReturn) return afterEvent.data;
    
    return model.id;
  }
  
  /**
   * 根据id修改数据
   * @param {string} id
   * @param {<#=tableUp#>Model} model
   * @return {Promise<string>}
   * @memberof <#=tableUp#>Service
   */
  async updateById(
    id: string,
    model: <#=tableUp#>Model,
  ): Promise<string> {
    const t = this;
    const table = "<#=table#>";
    const method = "updateById";
    
    const [ beforeEvent ] = await t.eventEmitter2.emitAsync(`service.before.${ method }.${ table }`, { model, id });
    if (beforeEvent?.isReturn) return beforeEvent.data;
    
    if (!id) {
      throw "updateById id can not be empty!";
    }
    if (process.env.NODE_ENV === "production") {
      await t.findById(id);
    }
    let result: ResultSetHeader = await t.<#=table#>Dao.updateById(id, model);
    
    const [ afterEvent ] = await t.eventEmitter2.emitAsync(`service.after.${ method }.${ table }`, { model, id, result });
    if (afterEvent?.isReturn) return afterEvent.data;
    
    return id;
  }
  
  /**
   * 根据id列表删除数据
   * @param {string[]} ids
   * @return {Promise<number>}
   * @memberof <#=tableUp#>Service
   */
  async deleteByIds(
    ids: string[],
  ): Promise<number> {
    const t = this;
    const table = "<#=table#>";
    const method = "deleteByIds";
    
    const [ beforeEvent ] = await t.eventEmitter2.emitAsync(`service.before.${ method }.${ table }`, { ids });
    if (beforeEvent?.isReturn) return beforeEvent.data;
    
    let num = await t.<#=table#>Dao.deleteByIds(ids);
    
    const [ afterEvent ] = await t.eventEmitter2.emitAsync(`service.after.${ method }.${ table }`, { ids, num });
    if (afterEvent?.isReturn) return afterEvent.data;
    
    return num;
  }
  
  /**
   * 根据id列表还原数据
   * @param {string[]} ids
   * @return {Promise<number>}
   * @memberof <#=tableUp#>Service
   */
  async revertByIds(
    ids: string[],
  ): Promise<number> {
    const t = this;
    const table = "<#=table#>";
    const method = "revertByIds";
    
    const [ beforeEvent ] = await t.eventEmitter2.emitAsync(`service.before.${ method }.${ table }`, { ids });
    if (beforeEvent?.isReturn) return beforeEvent.data;
    
    let num = await t.<#=table#>Dao.revertByIds(ids);
    
    const [ afterEvent ] = await t.eventEmitter2.emitAsync(`service.after.${ method }.${ table }`, { ids, num });
    if (afterEvent?.isReturn) return afterEvent.data;
    
    return num;
  }
  
  /**
   * 导出Excel
   * @param {<#=tableUp#>Search} search 搜索条件
   * @return {Promise<Buffer>}
   * @memberof <%=tableUp%>Service
   */
  async exportExcel(
    search?: <#=tableUp#>Search,
  ): Promise<Buffer> {
    const t = this;
    const table = "<#=table#>";
    const method = "exportExcel";
    
    const [ beforeEvent ] = await t.eventEmitter2.emitAsync(`service.before.${ method }.${ table }`, { search });
    if (beforeEvent?.isReturn) return beforeEvent.data;
    
    const models = await t.findAll(search);
    const buffer0 = await readFile(`${ __dirname }/<#=table#>.xlsx`);
    let buffer: Buffer;
    if (models.length > 1000) {
      buffer = await renderExcelWorker(buffer0, { models });
    } else {
      buffer = await renderExcel(buffer0, { models });
    }
    
    const [ afterEvent ] = await t.eventEmitter2.emitAsync(`service.after.${ method }.${ table }`, { search, buffer });
    if (afterEvent?.isReturn) return afterEvent.data;
    
    return buffer;
  }<#
  if (hasOrderBy) {
  #>
  
  /**
   * 查找order_by字段的最大值
   * @return {Promise<number>}
   * @memberof <#=tableUp#>Service
   */
  async findLastOrderBy(): Promise<number> {
    const t = this;
    const table = "<#=table#>";
    const method = "findLastOrderBy";
    
    const [ beforeEvent ] = await t.eventEmitter2.emitAsync(`service.before.${ method }.${ table }`, { });
    if (beforeEvent?.isReturn) return beforeEvent.data;
    
    let result = await t.<#=table#>Dao.findLastOrderBy();
    
    const [ afterEvent ] = await t.eventEmitter2.emitAsync(`service.after.${ method }.${ table }`, { result });
    if (afterEvent?.isReturn) return afterEvent.data;
    
    return result;
  }<#
  }
  #>
  
}
