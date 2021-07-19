import { readFile, writeFile } from "fs/promises";
import { resolve } from "path";

(async () => {
  const filePath = resolve(__dirname, "dist", "index.js");
  let contents = (await readFile(filePath)).toString();
  if (contents.startsWith('"use strict";')) {
    contents = `#!/usr/bin/env node\r\n\r\n${contents}`;
    await writeFile(filePath, contents);
  }
})();
