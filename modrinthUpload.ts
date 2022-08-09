import {
  gte as semverGte,
  // parse as semverParse,
} from "https://deno.land/x/semver@v1.4.1/mod.ts";

const PROJECT_ID = "something";

export const uploadToModrinth = async (
  fileName: string,
  version: string,
  gameVersion: string,
) => {
  const form = new FormData();

  const file = new File([await Deno.readFile(fileName)], fileName);

  const loader = semverGte(gameVersion, "1.13") ? "fabric" : "forge";

  const data = {
    "name": `${version}-${gameVersion}`,
    "version_number": `${version}-${gameVersion}`,
    "game_versions": [gameVersion],
    "version_type": "release",
    "loaders": [loader],
    "featured": false,
    "project_id": PROJECT_ID,
    "file_parts": [fileName],
    "dependencies": [],
  };
  form.append("data", JSON.stringify(data));
  form.append(fileName, file);

  const res = await fetch("https://api.modrinth.com/v2/version", {
    method: "POST",
    body: form,
    headers: {
      "Authorization": Deno.env.get("MODRINTH_TOKEN") ?? "",
    },
  });

  if (!res.ok) {
    console.error(`Failed to upload ${version} (${gameVersion})!`);
    console.error(await res.text());
    return;
  }

  console.log(`Uploaded ${version} (${gameVersion}) to Modrinth!`);
};
