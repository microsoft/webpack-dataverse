import find from "find";
import { join } from "path";

export default function findFile(path: string) {
  return new Promise<string>((resolve, reject) => {
    const parts = path.split(/[/\\]/);
    const fileName = parts.pop() as string;
    if (parts[0] !== ".") {
      parts.unshift(".");
    }
    const folderPath = join(...parts);
    find
      .file(
        new RegExp(`^(.*[/\\\\])?${fileName.replace(".", "\\.")}$`, "i"),
        folderPath,
        (files) => {
          if (files.length === 0) {
            reject(`Could not find file: ${path}`);
          } else if (files.length > 1) {
            reject(`Found multiple files with path: ${path}`);
          } else {
            resolve(files[0]);
          }
        }
      )
      .error(reject);
  });
}
