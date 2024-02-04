import {
  close,
} from "../context.ts";

import "/lib/env.ts";
import { createContext, handelChg } from "./hmr.ts";

const context = await createContext();

const filenames = [
  "D:/hugjs/nest/deno/src/menu/menu.dao.ts",
];
await handelChg(context, filenames);
await close(context);

// deno run --inspect-brk -A .\hmr.test.ts -c=D:/hugjs/nest/deno
