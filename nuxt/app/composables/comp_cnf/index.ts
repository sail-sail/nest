import {
  findAllCompCnf,
} from "./Api.ts";

export function initClientIsWebsiteEdit() {
  const url = useRequestURL();
  const query = new URLSearchParams(url.search);
  const isWebsiteEdit = query.get("website_edit") === "1";
  useIsWebsiteEdit().value = isWebsiteEdit;
}

export const useIsWebsiteEdit = () => useState<boolean>(
  "is_website_edit",
  () => false,
);

export async function initCompCnfs() {
  const compCnfs = await findAllCompCnf();
  const state = useCompCnfs();
  state.value = compCnfs;
}

export function useCompCnfs() {
  const compCnfs = useState<CompCnfModel[]>("comp_cnfs", () => []);
  return compCnfs;
}
