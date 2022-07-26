import { defineStore } from "pinia";
import { gqlQuery } from "@/utils/graphql";

export default defineStore("tenant", function() {
  
  async function getHost(): Promise<{ host: string }> {
    const rvData = await gqlQuery({
      query: /* GraphQL */ `
        query {
          getHostTenant {
            host
          }
        }
      `,
    });
    const data = rvData?.getHostTenant;
    return data;
  }
  
  return $$({
    getHost,
  });
  
});
