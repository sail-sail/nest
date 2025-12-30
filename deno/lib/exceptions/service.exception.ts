export class ServiceException extends Error {
  
  override message: string;
  code: string|undefined;
  /** 默认回滚事务, 可设置为不回滚事务而是提交事务 */
  _rollback: boolean|undefined;
  _showStack = false;
  
  constructor(message?: string, code?: string, _rollback?: boolean, _showStack = false) {
    super();
    this.code = code;
    this.message = message || super.message;
    this._rollback = _rollback;
    this._showStack = _showStack;
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
