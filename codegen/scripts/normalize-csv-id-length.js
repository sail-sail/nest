#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT_DIR = path.resolve(__dirname, '..', 'src', 'tables');
const TARGET_LENGTH = 22;

function parseCsvLine(line) {
  const values = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i += 1) {
    const ch = line[i];

    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (ch === ',' && !inQuotes) {
      values.push(current);
      current = '';
      continue;
    }

    current += ch;
  }

  values.push(current);
  return values;
}

function readCsvRows(content) {
  const lines = content.split(/\r\n|\n|\r/);
  const rows = [];

  for (const line of lines) {
    if (line === '' && rows.length > 0) {
      continue;
    }
    rows.push(parseCsvLine(line));
  }

  if (rows.length && rows[0].length && rows[0][0].startsWith('\uFEFF')) {
    rows[0][0] = rows[0][0].replace(/^\uFEFF/, '');
  }

  return rows;
}

function formatCsvRow(row) {
  return row
    .map((value) => {
      const raw = value == null ? '' : String(value);
      const escaped = raw.replace(/"/g, '""');
      const needsQuotes = /[",\n\r]|^=/.test(raw);
      return needsQuotes ? `"${escaped}"` : escaped;
    })
    .join(',');
}

function normalizeValue(value) {
  if (value == null) {
    return value;
  }

  const text = String(value);
  if (text === '') {
    return text;
  }

  if (text.length < TARGET_LENGTH) {
    return text + '='.repeat(TARGET_LENGTH - text.length);
  }

  if (text.length > TARGET_LENGTH) {
    return text.slice(0, TARGET_LENGTH);
  }

  return text;
}

function walkCsvFiles(dir) {
  if (!fs.existsSync(dir)) {
    return [];
  }

  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...walkCsvFiles(fullPath));
    } else if (entry.isFile() && fullPath.toLowerCase().endsWith('.csv')) {
      files.push(fullPath);
    }
  }

  return files;
}

function processCsvFile(filePath) {
  const originalContent = fs.readFileSync(filePath, 'utf8');
  const rows = readCsvRows(originalContent);

  if (rows.length === 0) {
    return { changed: false, updatedCount: 0 };
  }

  const headers = rows[0].map((header) => String(header).trim());
  const targetIndexes = headers
    .map((header, index) => ({ header, index }))
    .filter(({ header }) => {
      const normalized = header.toLowerCase();
      return normalized === 'id' || normalized.endsWith('_id');
    })
    .map(({ index }) => index);

  if (targetIndexes.length === 0) {
    return { changed: false, updatedCount: 0 };
  }

  let changed = false;
  let updatedCount = 0;

  const normalizedRows = rows.map((row, rowIndex) => {
    if (rowIndex === 0) {
      return row;
    }

    const nextRow = [...row];

    for (const targetIndex of targetIndexes) {
      if (targetIndex >= nextRow.length) {
        continue;
      }

      const originalValue = nextRow[targetIndex];
      const updatedValue = normalizeValue(originalValue);

      if (updatedValue !== originalValue) {
        nextRow[targetIndex] = updatedValue;
        changed = true;
        updatedCount += 1;
      }
    }

    return nextRow;
  });

  if (!changed) {
    return { changed: false, updatedCount: 0 };
  }

  const lineEnding = originalContent.includes('\r\n') ? '\r\n' : '\n';
  const newContent = normalizedRows.map(formatCsvRow).join(lineEnding);
  const finalContent = originalContent.endsWith('\n') || originalContent.endsWith('\r')
    ? newContent + lineEnding
    : newContent;

  fs.writeFileSync(filePath, finalContent, 'utf8');
  return { changed: true, updatedCount };
}

function main() {
  const files = walkCsvFiles(ROOT_DIR);
  let totalUpdatedFiles = 0;
  let totalUpdatedCount = 0;

  for (const file of files) {
    const result = processCsvFile(file);
    if (result.changed) {
      totalUpdatedFiles += 1;
      totalUpdatedCount += result.updatedCount;
    }
  }

  console.log(`Scanned ${files.length} CSV files under ${ROOT_DIR}`);
  console.log(`Updated ${totalUpdatedFiles} files with ${totalUpdatedCount} modified id-like values.`);
}

main();
