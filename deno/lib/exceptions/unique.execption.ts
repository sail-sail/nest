import { ServiceException } from "./service.exception.ts";

export class UniqueException extends ServiceException {
  
  constructor(message?: string) {
    super();
    this.code = "UniqueException";
    this.message = message || "唯一约束冲突";
  }
  
}
