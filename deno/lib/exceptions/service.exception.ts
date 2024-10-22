export class ServiceException extends Error {
  
  override message: string;
  code: string|undefined;
  /** 默认回滚事务, 可设置为不回滚事务而是提交事务 */
  _rollback: boolean|undefined;
  
  constructor(message?: string, code?: string, _rollback?: boolean) {
    super();
    this.code = code;
    this.message = message || super.message;
    this._rollback = _rollback;
  }
  
}

export class RollbackReturn extends Error {
  
  // deno-lint-ignore no-explicit-any
  value: any;
  
  // deno-lint-ignore no-explicit-any
  constructor(value: any) {
    super();
    this.value = value;
  }
  
}
