
export async function orgLoginSelect(
  org_id?: OrgId,
) {
  
  const {
    orgLoginSelect,
  } = await import("./org.service.ts");
  
  const token = await orgLoginSelect(org_id);
  
  return token;
}
