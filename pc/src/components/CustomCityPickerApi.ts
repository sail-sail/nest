
export type PcaItem = {
  code: string;
  name: string;
  children?: PcaItem[];
}

let findAllPcaCodeData: PcaItem[] | undefined;

export async function findAllPcaCode(): Promise<PcaItem[]> {
  if (findAllPcaCodeData) {
    return findAllPcaCodeData;
  }
  const res = await fetch("/pca-code.json");
  const data: PcaItem[] = await res.json();
  findAllPcaCodeData = data;
  return data;
}

function treeFind(children: PcaItem[], code: string): string {
  const item = children.find((item) => item.code === code);
  if (item) {
    return item.name ?? "";
  }
  for (const item of children) {
    if (!item.children) {
      continue;
    }
    const name = treeFind(item.children, code);
    if (name) {
      return name ?? "";
    }
  }
  return "";
}

/**
 * 根据省市区的code查找名称
 */
export async function findNameByCodePcaCode(code: string): Promise<string> {
  if (!code) {
    return "";
  }
  const data = await findAllPcaCode();
  const name = treeFind(data, code);
  return name ?? "";
}
