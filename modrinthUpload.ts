const PROJECT_ID = "something";

export const uploadToModrinth = async (
  fileName: string,
  version: string,
  gameVersion: string,
) => {
  const form = new FormData();

  const file = new File([await Deno.readFile(fileName)], fileName);

  const data = {
    "name": `${version}-${gameVersion}`,
    "version_number": `${version}-${gameVersion}`,
    "game_versions": [gameVersion],
    "version_type": "release",
    "loaders": ["fabric"],
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
    throw new Error(await res.text());
  }

  console.log(`Uploaded ${version} (${gameVersion}) to Modrinth!`);
};
