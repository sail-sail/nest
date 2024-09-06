import {
  getFieldPermit as getFieldPermitService,
} from "./field_permit.service.ts";

// 字段权限
export async function getFieldPermit(
  route_path: string,
): Promise<string[] | null> {
  
  const fields = await getFieldPermitService(route_path);
  
  return fields;
}
