import { ServiceException } from "./service.exception";

export class UniqueException extends ServiceException {
  
  constructor(message?: string) {
    super();
    const t = this;
    t.code = "UniqueException";
    t.message = message || "唯一约束冲突";
  }
  
}
