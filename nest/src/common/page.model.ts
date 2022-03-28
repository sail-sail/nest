
/**
 * 分页
 * @export
 * @interface PageModel
 */
export interface PageModel {
  
  /**
   * 偏移量
   * @type {number}
   * @memberof PageModel
   */
  pgOffset?: number,
  
  /**
   * 每页记录数
   * @type {number}
   * @memberof PageModel
   */
  pgSize?: number,
  
  /**
   * 总记录数
   * @type {number}
   * @memberof PageModel
   */
  pgTotal?: number,
  
  orderBy?: string,
  
  orderDec?: "asc"|"desc"|"ascending"|"descending",
  
}
