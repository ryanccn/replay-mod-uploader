import { uploadToModrinth } from "./modrinthUpload.ts";
import { join } from "https://deno.land/std@0.151.0/path/mod.ts";

for await (const f of Deno.readDir("builds/")) {
  if (!f.isFile) continue;

  const fullPath = join("builds", f.name);
  const [, gameVersion, replayModVersion] = fullPath.replaceAll(".jar", "")
    .split("-");

  await uploadToModrinth(fullPath, gameVersion, replayModVersion);
}
