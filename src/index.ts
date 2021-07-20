import build from "./cli/build";
import serve from "./cli/serve";

const args = process.argv.slice(2);

const command = args[0] || "serve";
switch (command) {
  case "serve":
    serve();
    break;
  case "build":
    build();
    break;
  default:
    throw new Error(`Unrecognized webpack-dataverse command: ${command}`);
}
