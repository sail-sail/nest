import {
  healthCheck as healthCheckHealth,
} from "./health.dao.ts";

export async function healthCheck() {
  await healthCheckHealth();
}
