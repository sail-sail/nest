import * as optionsService from "./options.service.ts";

export async function getOptionsByLbl(
  lbl: string,
) {
  return await optionsService.getOptionsByLbl(lbl);
}
