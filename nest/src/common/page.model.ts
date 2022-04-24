
/**
 * 分页
 * @export
 * @interface Page
 */
export interface Page {
  
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
  
}

/**
 * 排序
 * @export
 * @interface Sort
 */
export interface Sort {
  
  
  /**
   * 排序字段
   * @type {string}
   * @memberof Sort
   */
  prop?: string,
  
  
  /**
   * 排序方式
   * @type {("asc"|"desc"|"ascending"|"descending")}
   * @memberof Sort
   */
  order?: "asc"|"desc"|"ascending"|"descending",
  
}
