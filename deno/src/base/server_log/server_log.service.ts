import {
  join,
} from "@std/path";

import dayjs from "dayjs";

import {
  getEnv,
} from "/lib/env.ts";

import {
  SortOrderEnum,
} from "/gen/types.ts";

import type {
  PageInput,
  SortInput,
} from "/gen/types.ts";

interface RawLogEntry {
  log_date: string;
  log_time: string;
  level: string;
  req_id: string;
  module: string;
  content: string;
}

const LOG_LINE_RE = /^(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\.\d{3})\s+([A-Z]+)\s+(.*)$/;

function normalizeLevel(
  level: string,
) {
  if (level === "LOG") {
    return "INFO";
  }
  return level;
}

function getServerLogId(
  log_date: string,
  line_idx: number,
): ServerLogId {
  const date_str = log_date.replaceAll("-", "");
  return `${ date_str }_${ line_idx.toString().padStart(13, "0") }` as ServerLogId;
}

function parseServerLogId(
  id: ServerLogId,
) {
  const id_str = String(id || "");
  if (id_str.length !== 22) {
    return;
  }
  const [ date_str, line_idx_str ] = id_str.split("_");
  if (!date_str || !line_idx_str) {
    return;
  }
  const log_date = `${ date_str.slice(0, 4) }-${ date_str.slice(4, 6) }-${ date_str.slice(6, 8) }`;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(log_date)) {
    return;
  }
  const line_idx = Number(line_idx_str);
  if (!Number.isInteger(line_idx) || line_idx < 0) {
    return;
  }
  return {
    log_date,
    line_idx,
  };
}

async function getLogDir() {
  return await getEnv("log_path") || "../log";
}

async function getLogFileByDate(
  log_date: string,
): Promise<string | undefined> {
  const log_dir = await getLogDir();
  const direct_path = join(log_dir, `${ log_date }.log`);
  try {
    const stat = await Deno.stat(direct_path);
    if (stat.isFile) {
      return direct_path;
    }
  } catch (_err) {
    // 文件不存在时继续查找兼容的历史命名格式
  }
  try {
    for await (const file of Deno.readDir(log_dir)) {
      if (!file.isFile) {
        continue;
      }
      if (file.name === `${ log_date }.log` || file.name.endsWith(`.log.${ log_date }`)) {
        return join(log_dir, file.name);
      }
    }
  } catch (_err) {
    // 日志目录不存在时返回空结果
  }
}

function parseLogContent(
  content: string,
) {
  const entries: RawLogEntry[] = [ ];
  const lines = content.split(/\r?\n/);
  for (const line of lines) {
    if (!line) {
      if (entries.length > 0) {
        entries[entries.length - 1].content += "\n";
      }
      continue;
    }
    const match = line.match(LOG_LINE_RE);
    if (match) {
      const log_time = match[1];
      const level = normalizeLevel(match[2].trim().toUpperCase());
      const rest = match[3] || "";
      let req_id = "";
      let message = "";
      const space_idx = rest.indexOf(" ");
      if (space_idx >= 0) {
        req_id = rest.slice(0, space_idx).trim();
        message = rest.slice(space_idx + 1).trimStart();
      } else {
        req_id = rest.trim();
      }
      let module = "";
      let log_content = message;
      const module_sep_idx = message.indexOf(":");
      if (module_sep_idx > 0) {
        module = message.slice(0, module_sep_idx).trim();
        log_content = message.slice(module_sep_idx + 1).trimStart();
      }
      entries.push({
        log_date: log_time.slice(0, 10),
        log_time,
        level,
        req_id,
        module,
        content: log_content,
      });
      continue;
    }
    if (entries.length === 0) {
      continue;
    }
    const last = entries[entries.length - 1];
    if (last.content) {
      last.content += `\n${ line }`;
    } else {
      last.content = line;
    }
  }
  return entries;
}

async function readLogEntriesByDate(
  log_date: string,
): Promise<RawLogEntry[]> {
  const log_file = await getLogFileByDate(log_date);
  if (!log_file) {
    return [ ];
  }
  const content = await Deno.readTextFile(log_file);
  return parseLogContent(content);
}

function matchLike(
  value: string,
  keyword?: string | null,
) {
  if (!keyword) {
    return true;
  }
  return value.toLowerCase().includes(keyword.toLowerCase());
}

function isSame(
  value: string,
  target?: string | null,
) {
  if (target == null || target === "") {
    return true;
  }
  return value === target;
}

function matchesSearch(
  entry: RawLogEntry,
  search: ServerLogSearch,
) {
  if (search.level && search.level.length > 0) {
    const levels = search.level.map((item) => String(item).toUpperCase());
    if (!levels.includes(entry.level)) {
      return false;
    }
  }
  if (!isSame(entry.module, search.module)) {
    return false;
  }
  if (!matchLike(entry.module, search.module_like)) {
    return false;
  }
  if (!isSame(entry.req_id, search.req_id)) {
    return false;
  }
  if (!matchLike(entry.req_id, search.req_id_like)) {
    return false;
  }
  if (!isSame(entry.content, search.content)) {
    return false;
  }
  if (!matchLike(entry.content, search.content_like)) {
    return false;
  }
  if (search.log_time?.[0] && entry.log_time < search.log_time[0]) {
    return false;
  }
  if (search.log_time?.[1] && entry.log_time > search.log_time[1]) {
    return false;
  }
  return true;
}

function intoServerLogModel(
  entry: RawLogEntry,
  line_idx: number,
): ServerLogModel {
  const level = entry.level as ServerLogModel["level"];
  return {
    id: getServerLogId(entry.log_date, line_idx),
    log_date: entry.log_date,
    log_date_lbl: entry.log_date,
    log_time: entry.log_time,
    log_time_lbl: entry.log_time,
    level,
    level_lbl: entry.level,
    module: entry.module,
    req_id: entry.req_id,
    content: entry.content,
  };
}

function getSortIsDesc(
  sort?: SortInput[],
) {
  const order = sort?.[0]?.order;
  if (!order) {
    return true;
  }
  return ![
    SortOrderEnum.Asc,
    SortOrderEnum.Ascending,
    "asc",
    "ascending",
  ].includes(order);
}

function getPageInfo(
  page?: PageInput,
) {
  const offset = Math.max(page?.pgOffset || 0, 0);
  const size = Math.max(page?.pgSize || 20, 0);
  return {
    offset,
    size,
  };
}

function getSearchDateRange(
  search?: ServerLogSearch,
) {
  const start = search?.log_date?.[0];
  const end = search?.log_date?.[1];
  const today = dayjs().format("YYYY-MM-DD");
  const start_date = start || end || today;
  const end_date = end || start || today;
  const start_day = dayjs(start_date);
  const end_day = dayjs(end_date);
  if (!start_day.isValid() || !end_day.isValid()) {
    return [ today ];
  }
  const min_day = start_day.isBefore(end_day) ? start_day : end_day;
  const max_day = start_day.isBefore(end_day) ? end_day : start_day;
  const dates: string[] = [ ];
  let current = min_day;
  while (current.isBefore(max_day) || current.isSame(max_day, "day")) {
    dates.push(current.format("YYYY-MM-DD"));
    if (dates.length >= 31) {
      break;
    }
    current = current.add(1, "day");
  }
  return dates;
}

function getHasFilter(
  search: ServerLogSearch,
) {
  return Boolean(
    search.level?.length ||
    search.module ||
    search.module_like ||
    search.req_id ||
    search.req_id_like ||
    search.content ||
    search.content_like ||
    search.log_time?.[0] ||
    search.log_time?.[1]
  );
}

export async function findCountServerLog(
  search?: ServerLogSearch,
): Promise<number> {
  const search2 = search || { };
  if (search2.id) {
    return (await findByIdServerLog(search2.id)) ? 1 : 0;
  }
  if (search2.ids) {
    const models = await findByIdsServerLog(search2.ids);
    return models.length;
  }
  const dates = getSearchDateRange(search2);
  const has_filter = getHasFilter(search2);
  let total = 0;
  for (const log_date of dates) {
    const log_file = await getLogFileByDate(log_date);
    if (!log_file) {
      continue;
    }
    if (!has_filter) {
      const content = await Deno.readTextFile(log_file);
      const lines = content.split(/\r?\n/);
      for (const line of lines) {
        if (LOG_LINE_RE.test(line)) {
          total++;
        }
      }
      continue;
    }
    const entries = await readLogEntriesByDate(log_date);
    for (const entry of entries) {
      if (matchesSearch(entry, search2)) {
        total++;
      }
    }
  }
  return total;
}

export async function findAllServerLog(
  search?: ServerLogSearch,
  page?: PageInput,
  sort?: SortInput[],
): Promise<ServerLogModel[]> {
  const search2 = search || { };
  if (search2.id) {
    const model = await findByIdServerLog(search2.id);
    return model ? [ model ] : [ ];
  }
  if (search2.ids) {
    return await findByIdsServerLog(search2.ids);
  }
  const is_desc = getSortIsDesc(sort);
  const { offset, size } = getPageInfo(page);
  const collect_size = offset + size;
  const dates = getSearchDateRange(search2).sort((a, b) => is_desc ? b.localeCompare(a) : a.localeCompare(b));
  const models: ServerLogModel[] = [ ];
  for (const log_date of dates) {
    const entries = await readLogEntriesByDate(log_date);
    if (entries.length === 0) {
      continue;
    }
    if (is_desc) {
      for (let i = entries.length - 1; i >= 0; i--) {
        const entry = entries[i];
        if (!matchesSearch(entry, search2)) {
          continue;
        }
        models.push(intoServerLogModel(entry, i));
        if (collect_size > 0 && models.length >= collect_size) {
          break;
        }
      }
    } else {
      for (let i = 0; i < entries.length; i++) {
        const entry = entries[i];
        if (!matchesSearch(entry, search2)) {
          continue;
        }
        models.push(intoServerLogModel(entry, i));
        if (collect_size > 0 && models.length >= collect_size) {
          break;
        }
      }
    }
    if (collect_size > 0 && models.length >= collect_size) {
      break;
    }
  }
  if (size <= 0) {
    return [ ];
  }
  return models.slice(offset, offset + size);
}

export async function findOneServerLog(
  search?: ServerLogSearch,
  sort?: SortInput[],
): Promise<ServerLogModel | undefined> {
  const models = await findAllServerLog(
    search,
    {
      pgOffset: 0,
      pgSize: 1,
    },
    sort,
  );
  return models[0];
}

export async function findOneOkServerLog(
  search?: ServerLogSearch,
  sort?: SortInput[],
): Promise<ServerLogModel> {
  const model = await findOneServerLog(search, sort);
  if (!model) {
    throw "此 系统日志 已被删除";
  }
  return model;
}

export async function findByIdServerLog(
  server_log_id: ServerLogId,
): Promise<ServerLogModel | undefined> {
  const id_info = parseServerLogId(server_log_id);
  if (!id_info) {
    return;
  }
  const entries = await readLogEntriesByDate(id_info.log_date);
  const entry = entries[id_info.line_idx];
  if (!entry) {
    return;
  }
  return intoServerLogModel(entry, id_info.line_idx);
}

export async function findByIdOkServerLog(
  server_log_id: ServerLogId,
): Promise<ServerLogModel> {
  const model = await findByIdServerLog(server_log_id);
  if (!model) {
    throw "此 系统日志 已被删除";
  }
  return model;
}

export async function findByIdsServerLog(
  server_log_ids: ServerLogId[],
): Promise<ServerLogModel[]> {
  const models: ServerLogModel[] = [ ];
  for (const id of server_log_ids) {
    const model = await findByIdServerLog(id);
    if (model) {
      models.push(model);
    }
  }
  return models;
}

export async function findByIdsOkServerLog(
  server_log_ids: ServerLogId[],
): Promise<ServerLogModel[]> {
  const models: ServerLogModel[] = [ ];
  for (const id of server_log_ids) {
    const model = await findByIdServerLog(id);
    if (!model) {
      throw `系统日志 ${ id } 未找到`;
    }
    models.push(model);
  }
  return models;
}

export async function existServerLog(
  search?: ServerLogSearch,
): Promise<boolean> {
  return Boolean(await findOneServerLog(search));
}

export async function existByIdServerLog(
  server_log_id?: ServerLogId | null,
): Promise<boolean> {
  if (!server_log_id) {
    return false;
  }
  return Boolean(await findByIdServerLog(server_log_id));
}

export async function downloadServerLog(
  log_date: string,
): Promise<string> {
  const log_file = await getLogFileByDate(log_date);
  if (!log_file) {
    throw `未找到 ${ log_date } 的日志文件`;
  }
  return await Deno.readTextFile(log_file);
}

export async function getServerLogDates(): Promise<string[]> {
  const log_dir = await getLogDir();
  const dates: string[] = [ ];
  try {
    for await (const file of Deno.readDir(log_dir)) {
      if (!file.isFile) {
        continue;
      }
      if (/^\d{4}-\d{2}-\d{2}\.log$/.test(file.name)) {
        dates.push(file.name.slice(0, 10));
        continue;
      }
      const match = file.name.match(/\.log\.(\d{4}-\d{2}-\d{2})$/);
      if (match?.[1]) {
        dates.push(match[1]);
      }
    }
  } catch (_err) {
    return [ ];
  }
  return Array.from(new Set(dates)).sort((a, b) => b.localeCompare(a));
}