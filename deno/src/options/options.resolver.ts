import {
  _internals as optionsService,
} from "./options.service.ts";

export const _internals = {
  getOptionsByLbl,
};

async function getOptionsByLbl(
  lbl: string,
) {
  return await optionsService.getOptionsByLbl(lbl);
}
