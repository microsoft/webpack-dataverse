import { program } from "commander";
import build from "./cli/build";
import serve from "./cli/serve";

program
  .command("serve")
  .description(
    "Run webpack and automatically upload generated assets to Dataverse."
  )
  .action(serve);

program
  .command("build")
  .description(
    "Run webpack generating local assets (written to the portal contents folder)."
  )
  .option(
    "-p, --production",
    'Override webpack "mode", setting it to "production".'
  )
  .action(build);

program.parse();
