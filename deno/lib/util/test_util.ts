Deno.chdir("D:/hugjs/nest/deno/");

import "/lib/env.ts";
import "/lib/util/date_util.ts";

import {
  close,
  commit,
  rollback,
  newContext,
  runInAsyncHooks,
} from "/lib/context.ts";

export function wrap(callback: () => Promise<void>) {
  return async () => {
    // deno-lint-ignore no-explicit-any
    const context = newContext(undefined as any);
    context.notVerifyToken = true;
    context.is_tran = true;
    await runInAsyncHooks(
      context,
      async () => {
        try {
          await callback();
        } catch(err) {
          await rollback();
          throw err;
        } finally {
          await commit();
          await close();
        }
      },
    );
  };
}
