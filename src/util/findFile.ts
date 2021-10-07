import escapeRegExp from "escape-string-regexp";
import { fileSync as find } from "find";
import { join } from "path";

export default function findFile(path: string) {
  const parts = path.split(/[/\\]/);
  const fileName = escapeRegExp(parts.pop()!);
  if (parts[0] !== ".") {
    parts.unshift(".");
  }
  const folderPath = join(...parts);

  const files = find(new RegExp(`^(.*[/\\\\])?${fileName}$`, "i"), folderPath);

  if (files.length === 0) {
    throw new Error(`Could not find file: ${path}`);
  } else if (files.length > 1) {
    throw new Error(`Found multiple files with path: ${path}`);
  } else {
    return files[0];
  }
}
