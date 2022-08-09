import { uploadToModrinth } from "./modrinthUpload.ts";
import { join } from "https://deno.land/std@0.151.0/path/mod.ts";

const BUILD_DIRECTORY = "builds";

for await (const f of Deno.readDir(BUILD_DIRECTORY)) {
  if (!f.isFile) continue;

  const fullPath = join(BUILD_DIRECTORY, f.name);
  const [, gameVersion, replayModVersion] = fullPath.replaceAll(".jar", "")
    .split("-");

  await uploadToModrinth(fullPath, gameVersion, replayModVersion);
}
