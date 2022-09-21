Deno.chdir("D:/hugjs/nest/deno/");

import "/lib/env.ts";
import "/lib/util/date_util.ts";

import {
  Context,
} from "/lib/context.ts";

export function wrap(callback: (context: Context) => Promise<void>) {
  return async () => {
    const context = new Context();
    context.notVerifyToken = true;
    context.is_tran = true;
    try {
      await callback(context);
    } catch(err) {
      await context.rollback();
      throw err;
    } finally {
      await context.commit();
      await context.close();
    }
  };
}
