import {
  parse,
  print,
  visit,
  type DefinitionNode,
  type EnumTypeDefinitionNode,
  type FieldDefinitionNode,
  type InputObjectTypeDefinitionNode,
  type InputValueDefinitionNode,
  type InterfaceTypeDefinitionNode,
  type ObjectTypeDefinitionNode,
  type TypeNode,
  type UnionTypeDefinitionNode,
} from "graphql";

import {
  getGraphqlSchemaSDL,
} from "/lib/oak/gql.ts";

export const SCHEMA_SEARCH_KINDS = [
  "type",
  "input",
  "enum",
  "scalar",
  "interface",
  "union",
  "field",
] as const;

export type SchemaSearchKind = typeof SCHEMA_SEARCH_KINDS[number];

interface DefinitionRecord {
  name: string;
  normalizedName: string;
  kind: Exclude<SchemaSearchKind, "field">;
  description: string;
  sdl: string;
  relatedTypes: string[];
  searchText: string;
}

interface MemberRecord {
  name: string;
  normalizedName: string;
  parentName: string;
  parentKind: Exclude<SchemaSearchKind, "field">;
  kind: "field";
  description: string;
  signature: string;
  sdl: string;
  searchText: string;
}

interface SchemaIndex {
  schemaSDL: string;
  definitions: DefinitionRecord[];
  members: MemberRecord[];
}

let schemaIndexCache: SchemaIndex | undefined;

const MAX_PREVIEW_LENGTH = 320;
const MAX_SCHEMA_GET_LENGTH = 12_000;

export function searchSchema(
  query: string,
  kind?: SchemaSearchKind,
  limit = 10,
) {
  const normalizedQuery = normalizeText(query);
  if (!normalizedQuery) {
    throw new Error("query 不能为空");
  }

  const index = getSchemaIndex();
  const nextLimit = Math.min(Math.max(limit || 10, 1), 30);
  const items: Array<Record<string, unknown> & { score: number }> = [ ];

  if (!kind || kind !== "field") {
    for (const definition of index.definitions) {
      if (kind && definition.kind !== kind) {
        continue;
      }
      const score = scoreDefinition(definition, normalizedQuery);
      if (score <= 0) {
        continue;
      }
      items.push({
        matchType: "definition",
        name: definition.name,
        kind: definition.kind,
        description: definition.description,
        relatedTypes: definition.relatedTypes,
        preview: toPreview(definition.sdl),
        score,
      });
    }
  }

  if (!kind || kind === "field") {
    for (const member of index.members) {
      const score = scoreMember(member, normalizedQuery);
      if (score <= 0) {
        continue;
      }
      items.push({
        matchType: "field",
        name: member.name,
        kind: member.kind,
        parentName: member.parentName,
        parentKind: member.parentKind,
        description: member.description,
        signature: member.signature,
        preview: toPreview(member.sdl),
        score,
      });
    }
  }

  const resultItems = items
    .sort((left, right) => {
      if (right.score !== left.score) {
        return right.score - left.score;
      }
      return String(left.name).localeCompare(String(right.name), "zh-CN");
    })
    .slice(0, nextLimit)
    .map(({ score: _score, ...item }) => item);

  return {
    total: resultItems.length,
    items: resultItems,
  };
}

export function getSchemaDefinition(
  name: string,
  kind?: Exclude<SchemaSearchKind, "field">,
) {
  const normalizedName = normalizeText(name);
  if (!normalizedName) {
    throw new Error("name 不能为空");
  }
  if (isAiFilteredName(name)) {
    throw new Error(`类型 ${ name } 默认不对 AI 暴露`);
  }

  const index = getSchemaIndex();
  const candidates = index.definitions.filter((item) => {
    if (item.normalizedName !== normalizedName) {
      return false;
    }
    if (kind && item.kind !== kind) {
      return false;
    }
    return true;
  });

  if (candidates.length === 0) {
    throw new Error(`未找到类型 ${ name }`);
  }
  if (candidates.length > 1 && !kind) {
    throw new Error(`类型 ${ name } 存在多个 kind，请补充 kind 参数`);
  }

  const definition = candidates[0];
  if ((definition.name === "Query" || definition.name === "Mutation") && definition.sdl.length > 2000) {
    throw new Error(`${ definition.name } 聚合类型过大，请先使用 schema_search 定位字段，再查询具体类型`);
  }
  if (definition.sdl.length > MAX_SCHEMA_GET_LENGTH) {
    throw new Error(`类型 ${ definition.name } 过大，请先使用 schema_search 缩小范围`);
  }

  return {
    name: definition.name,
    kind: definition.kind,
    description: definition.description,
    relatedTypes: definition.relatedTypes,
    sdl: definition.sdl,
    queryTips: [
      "执行 findAll* 时务必提供 page 参数。",
      "page.pgSize 默认 20，最大 2000。",
    ],
  };
}

function getSchemaIndex() {
  const schemaSDL = getGraphqlSchemaSDL();
  if (schemaIndexCache && schemaIndexCache.schemaSDL === schemaSDL) {
    return schemaIndexCache;
  }

  const document = parse(schemaSDL, {
    noLocation: true,
  });
  const definitions: DefinitionRecord[] = [ ];
  const members: MemberRecord[] = [ ];

  for (const definition of document.definitions) {
    const nextDefinition = toDefinitionRecord(definition);
    if (!nextDefinition) {
      continue;
    }
    definitions.push(nextDefinition);
    members.push(...toMemberRecords(definition, nextDefinition));
  }

  schemaIndexCache = {
    schemaSDL,
    definitions,
    members,
  };
  return schemaIndexCache;
}

function toDefinitionRecord(
  definition: DefinitionNode,
): DefinitionRecord | undefined {
  const namedDefinition = definition as DefinitionNode & {
    name?: {
      value: string;
    };
    description?: {
      value: string;
    };
  };

  const name = namedDefinition.name?.value;
  if (!name || isAiFilteredName(name)) {
    return undefined;
  }

  const kind = toDefinitionKind(definition.kind);
  if (!kind) {
    return undefined;
  }

  const description = namedDefinition.description?.value?.trim() || "";
  const sdl = print(definition).trim();
  const relatedTypes = collectRelatedTypes(definition, name);
  const searchText = normalizeText([
    name,
    description,
    kind,
    relatedTypes.join(" "),
    sdl,
  ].join(" "));

  return {
    name,
    normalizedName: normalizeText(name),
    kind,
    description,
    sdl,
    relatedTypes,
    searchText,
  };
}

function toMemberRecords(
  definition: DefinitionNode,
  parent: DefinitionRecord,
) {
  const members: MemberRecord[] = [ ];

  if (
    definition.kind === "ObjectTypeDefinition"
    || definition.kind === "InterfaceTypeDefinition"
  ) {
    const fields = definition.fields || [ ];
    for (const field of fields) {
      const nextMember = buildObjectFieldMember(parent, field);
      if (nextMember) {
        members.push(nextMember);
      }
    }
  }

  if (definition.kind === "InputObjectTypeDefinition") {
    const fields = definition.fields || [ ];
    for (const field of fields) {
      const nextMember = buildInputFieldMember(parent, field);
      if (nextMember) {
        members.push(nextMember);
      }
    }
  }

  if (definition.kind === "EnumTypeDefinition") {
    const values = definition.values || [ ];
    for (const value of values) {
      if (isAiFilteredName(value.name.value)) {
        continue;
      }
      const description = value.description?.value?.trim() || "";
      const signature = `${ value.name.value }`;
      members.push({
        name: value.name.value,
        normalizedName: normalizeText(value.name.value),
        parentName: parent.name,
        parentKind: parent.kind,
        kind: "field",
        description,
        signature,
        sdl: signature,
        searchText: normalizeText([
          value.name.value,
          description,
          parent.name,
          parent.kind,
          signature,
        ].join(" ")),
      });
    }
  }

  return members;
}

function buildObjectFieldMember(
  parent: DefinitionRecord,
  field: FieldDefinitionNode,
) {
  if (isAiFilteredName(field.name.value)) {
    return undefined;
  }
  const description = field.description?.value?.trim() || "";
  const signature = `${ field.name.value }${ formatFieldArgs(field) }: ${ print(field.type).trim() }`;
  return {
    name: field.name.value,
    normalizedName: normalizeText(field.name.value),
    parentName: parent.name,
    parentKind: parent.kind,
    kind: "field" as const,
    description,
    signature,
    sdl: signature,
    searchText: normalizeText([
      field.name.value,
      description,
      parent.name,
      parent.kind,
      signature,
    ].join(" ")),
  };
}

function buildInputFieldMember(
  parent: DefinitionRecord,
  field: InputValueDefinitionNode,
) {
  if (isAiFilteredName(field.name.value)) {
    return undefined;
  }
  const description = field.description?.value?.trim() || "";
  const signature = `${ field.name.value }: ${ print(field.type).trim() }`;
  return {
    name: field.name.value,
    normalizedName: normalizeText(field.name.value),
    parentName: parent.name,
    parentKind: parent.kind,
    kind: "field" as const,
    description,
    signature,
    sdl: signature,
    searchText: normalizeText([
      field.name.value,
      description,
      parent.name,
      parent.kind,
      signature,
    ].join(" ")),
  };
}

function collectRelatedTypes(
  definition: DefinitionNode,
  selfName: string,
) {
  const relatedTypes = new Set<string>();
  visit(definition, {
    NamedType(node) {
      if (node.name.value !== selfName) {
        relatedTypes.add(node.name.value);
      }
    },
  });
  return Array.from(relatedTypes).sort((left, right) => left.localeCompare(right, "zh-CN"));
}

function toDefinitionKind(
  definitionKind: DefinitionNode["kind"],
): Exclude<SchemaSearchKind, "field"> | undefined {
  switch (definitionKind) {
    case "ObjectTypeDefinition":
      return "type";
    case "InputObjectTypeDefinition":
      return "input";
    case "EnumTypeDefinition":
      return "enum";
    case "ScalarTypeDefinition":
      return "scalar";
    case "InterfaceTypeDefinition":
      return "interface";
    case "UnionTypeDefinition":
      return "union";
    default:
      return undefined;
  }
}

function formatFieldArgs(
  field: FieldDefinitionNode,
) {
  if (!field.arguments || field.arguments.length === 0) {
    return "";
  }
  const args = field.arguments.map((item) => `${ item.name.value }: ${ print(item.type).trim() }`);
  return `(${ args.join(", ") })`;
}

function scoreDefinition(
  definition: DefinitionRecord,
  normalizedQuery: string,
) {
  let score = 0;
  if (definition.normalizedName === normalizedQuery) {
    score += 120;
  } else if (definition.normalizedName.startsWith(normalizedQuery)) {
    score += 90;
  } else if (definition.normalizedName.includes(normalizedQuery)) {
    score += 70;
  }
  if (definition.searchText.includes(normalizedQuery)) {
    score += 30;
  }
  if (definition.description && normalizeText(definition.description).includes(normalizedQuery)) {
    score += 15;
  }
  return score;
}

function scoreMember(
  member: MemberRecord,
  normalizedQuery: string,
) {
  let score = 0;
  if (member.normalizedName === normalizedQuery) {
    score += 110;
  } else if (member.normalizedName.startsWith(normalizedQuery)) {
    score += 85;
  } else if (member.normalizedName.includes(normalizedQuery)) {
    score += 60;
  }
  if (member.searchText.includes(normalizedQuery)) {
    score += 25;
  }
  if (normalizeText(member.parentName).includes(normalizedQuery)) {
    score += 10;
  }
  return score;
}

function normalizeText(
  value: string,
) {
  return value.trim().toLowerCase().replaceAll(/\s+/g, " ");
}

function toPreview(
  value: string,
) {
  const nextValue = value.trim();
  if (nextValue.length <= MAX_PREVIEW_LENGTH) {
    return nextValue;
  }
  return `${ nextValue.slice(0, MAX_PREVIEW_LENGTH) }...`;
}

function isAiFilteredName(
  name: string,
) {
  return /^findOneOk/.test(name)
    || /^findByIdOk/.test(name)
    || /^findByIdsOk/.test(name)
    || /^getFieldComments/.test(name)
    || /FieldComment$/.test(name);
}