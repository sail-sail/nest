import config from "@/utils/config";

export type PcaItem = {
  code: string;
  name: string;
  children?: PcaItem[];
};

let findAllPcaCodeData: PcaItem[] | undefined;
let findAllPcaCodePrm: Promise<PcaItem[]> | undefined;

export async function findAllPcaCode(): Promise<PcaItem[]> {
  if (findAllPcaCodeData) {
    return findAllPcaCodeData;
  }
  if (!findAllPcaCodePrm) {
    findAllPcaCodePrm = new Promise<PcaItem[]>((resolve, reject) => {
      uni.request({
        url: `${ config.urlBase }/pca-code.json`,
        method: "GET",
        success(res) {
          if (res.statusCode < 200 || res.statusCode >= 300) {
            reject(new Error(`省市区数据请求失败: ${ res.statusCode }`));
            return;
          }
          if (!Array.isArray(res.data)) {
            reject(new Error("省市区数据格式错误"));
            return;
          }
          findAllPcaCodeData = res.data as PcaItem[];
          resolve(findAllPcaCodeData);
        },
        fail(err) {
          reject(err);
        },
      });
    }).catch((err) => {
      findAllPcaCodePrm = undefined;
      throw err;
    });
  }
  return await findAllPcaCodePrm;
}

function treeFind(children: PcaItem[], code: string): string {
  const item = children.find((child) => child.code === code);
  if (item) {
    return item.name ?? "";
  }
  for (const child of children) {
    if (!child.children) {
      continue;
    }
    const name = treeFind(
      child.children,
      code,
    );
    if (name) {
      return name;
    }
  }
  return "";
}

/**
 * 根据省市区 code 查找名称
 */
export async function findNameByCodePcaCode(code: string): Promise<string> {
  if (!code) {
    return "";
  }
  const data = await findAllPcaCode();
  return treeFind(
    data,
    code,
  ) ?? "";
}