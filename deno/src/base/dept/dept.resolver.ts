export async function deptLoginSelect(
  dept_id: string,
) {
  const {
    deptLoginSelect,
  } = await import("./dept.service.ts");
  const token = await deptLoginSelect(dept_id);
  return token;
}
