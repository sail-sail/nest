import { Client } from "@lancedb/arrow-flight-sql-client";

(async function() {
  const client = await Client.connect({
    host: "39.104.15.113:8904",
    username: "root",
    password: "hCpz8rX59tJFUxCq",
    insecure: true,
  });
  const result = await client.query("SELECT 1");
  console.log(await result.collectToObjects());
})();