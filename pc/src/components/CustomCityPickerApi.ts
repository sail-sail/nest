
export type PcaItem = {
  code: string;
  name: string;
  children?: PcaItem[];
}

const findAllPcaCodeDataKey = "CustomCityPicker.findAllPcaCodeData";

function loadPcaCodeDataFromStorage(): PcaItem[] | undefined {
  const str = localStorage.getItem(findAllPcaCodeDataKey);
  if (!str) {
    return undefined;
  }
  try {
    const data = JSON.parse(str);
    if (Array.isArray(data)) {
      return data as PcaItem[];
    }
  } catch {
    // ignore invalid cache data and refresh from server
  }
  localStorage.removeItem(findAllPcaCodeDataKey);
  return undefined;
}

let findAllPcaCodeData: PcaItem[] | undefined = loadPcaCodeDataFromStorage();

function savePcaCodeDataToStorage(data: PcaItem[]): void {
  try {
    localStorage.setItem(findAllPcaCodeDataKey, JSON.stringify(data));
  } catch {
    // ignore storage failures and use memory cache only
  }
}

export async function findAllPcaCode(): Promise<PcaItem[]> {
  if (findAllPcaCodeData) {
    return findAllPcaCodeData;
  }
  const res = await fetch("/pca-code.json");
  const data: PcaItem[] = await res.json();
  findAllPcaCodeData = data;
  savePcaCodeDataToStorage(data);
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
