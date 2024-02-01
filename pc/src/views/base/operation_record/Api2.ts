
export async function getDetailByCompPath(
  comp_path: string,
) {
  if (!comp_path) {
    return;
  }
  return await import(comp_path);
}
