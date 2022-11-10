import "/lib/env.ts";
import { createContext, handelChg } from "./hmr.ts";

const context = await createContext();

const filenames = [
  "D:/hugjs/nest/deno/src/menu/menu.dao.ts",
];
await handelChg(context, filenames);
await context.close();

// deno run --inspect-brk -A --import-map=../../import_map.json --no-check .\hmr.test.ts -c=D:/hugjs/nest/deno
