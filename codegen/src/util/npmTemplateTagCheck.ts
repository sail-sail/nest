#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

interface FileError {
  file: string;
  line: number;
  column: number;
  message: string;
}

function lineColFromIndex(text: string, index: number): { line: number; column: number } {
  let line = 1;
  let column = 1;

  for (let i = 0; i < index; i += 1) {
    if (text[i] === "\n") {
      line += 1;
      column = 1;
    } else {
      column += 1;
    }
  }

  return { line, column };
}

function checkTemplateTags(file: string, text: string): FileError[] {
  const errors: FileError[] = [];
  let inTag = false;
  let tagStart = -1;
  let quote: string | null = null;
  let escaped = false;

  for (let i = 0; i < text.length; i += 1) {
    const ch = text[i];
    const next = text[i + 1];

    if (quote) {
      if (escaped) {
        escaped = false;
        continue;
      }
      if (ch === "\\") {
        escaped = true;
        continue;
      }
      if (ch === quote) {
        quote = null;
      }
      continue;
    }

    if (ch === '"' || ch === "'" || ch === "`") {
      quote = ch;
      continue;
    }

    if (inTag) {
      if (text.startsWith("#>", i)) {
        inTag = false;
        tagStart = -1;
        i += 1;
        continue;
      }

      if (text.startsWith("<#", i)) {
        const pos = lineColFromIndex(text, i);
        errors.push({
          file,
          line: pos.line,
          column: pos.column,
          message: "Detected nested <# before previous #> closed.",
        });
        return errors;
      }

      continue;
    }

    if (text.startsWith("<#", i)) {
      inTag = true;
      tagStart = i;
      i += 1;
      continue;
    }

    if (text.startsWith("#>", i)) {
      const pos = lineColFromIndex(text, i);
      errors.push({
        file,
        line: pos.line,
        column: pos.column,
        message: "Detected stray #> without a matching <#.",
      });
      return errors;
    }
  }

  if (inTag && tagStart >= 0) {
    const pos = lineColFromIndex(text, tagStart);
    errors.push({
      file,
      line: pos.line,
      column: pos.column,
      message: "Unclosed <# ... #> tag.",
    });
  }

  return errors;
}

function walkFiles(target: string): string[] {
  const stat = fs.statSync(target);
  if (stat.isFile()) {
    return [target];
  }

  const files: string[] = [];
  function visit(dir: string): void {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        visit(fullPath);
        continue;
      }
      files.push(fullPath);
    }
  }

  visit(target);
  return files;
}

function main(): void {
  const targets = process.argv.slice(2);
  const inputTargets = targets.length > 0 ? targets : [path.resolve(process.cwd(), "src/template")];
  const files = new Set<string>();

  for (const target of inputTargets) {
    const absoluteTarget = path.resolve(process.cwd(), target);
    for (const file of walkFiles(absoluteTarget)) {
      files.add(file);
    }
  }

  const fileList = Array.from(files).sort();
  const allErrors: FileError[] = [];

  for (const file of fileList) {
    const text = fs.readFileSync(file, "utf8");
    const errors = checkTemplateTags(file, text);
    for (const error of errors) {
      allErrors.push(error);
    }
  }

  if (allErrors.length > 0) {
    console.error(`Template tag check failed: ${allErrors.length} issue(s) found.`);
    for (const error of allErrors) {
      console.error(`${path.relative(process.cwd(), error.file)}:${error.line}:${error.column}: ${error.message}`);
    }
    process.exit(1);
  }

  console.log(`Template tag check passed: ${fileList.length} file(s) scanned, no unclosed or nested <# ... #> tags found.`);
}

main();
