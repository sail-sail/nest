import { gitDiffOut } from "../lib/codegen";

async function exec() {
  await gitDiffOut();
}

(async function() {
  try {
    await exec();
  } catch(err) {
    console.error(err);
  } finally {
    process.exit(0);
  }
})();