import { build, emptyDir } from "https://deno.land/x/dnt@0.39.0/mod.ts";

const cleanupTypes = async (dir: string) => {
  for await (const dirEntry of Deno.readDir(dir)) {
    const entryPath = `${dir}/${dirEntry.name}`;
    if (dirEntry.isDirectory) {
      await cleanupTypes(entryPath);
    } else {
      const file = await Deno.readTextFile(entryPath);
      const newFile = file.replaceAll('.js"', '"');
      await Deno.writeTextFile(entryPath, newFile);
    }
  }
};

await emptyDir("./npm");

await build({
  entryPoints: ["./src/node/index.ts"],
  outDir: "./npm",
  mappings: {},
  declaration: "separate",
  skipSourceOutput: true,
  scriptModule: false,
  shims: {
    custom: [
      {
        package: {
          name: "node-fetch",
          version: "~3.3.2",
        },
        globalNames: [
          {
            name: "RequestInit",
            typeOnly: true, // only used in type declarations
          },
          {
            name: "Response",
            typeOnly: true, // only used in type declarations
          },
        ],
      },
    ],
  },
  test: false,
  typeCheck: false,
  compilerOptions: {
    importHelpers: false,
    target: "ES2021",
  },
  package: {
    // package.json properties
    name: "yt-transcripts",
    version: Deno.args[0] || "1.0.0",
    description: "YT Transcripts, a module to get transcripts from YouTube videos",
    license: "MIT",
    publishConfiig: {
      access: "public",
    },
    keywords: [
      "youtube",
      "transcripts",
      "video",
      "api",
      "client",
      "typescript",
    ],
    author: {
      name: "J.W. Lagendijk",
      email: "jwlagendijk@gmail.com",
    },
    repository: {
      type: "git",
      url: "git+https://github.com/j3lte/yt-transcripts.git",
    },
    bugs: {
      url: "https://github.com/j3lte/yt-transcripts/issues",
    },
  },
  async postBuild(): Promise<void> {
    // steps to run after building and before running the tests
    await Deno.copyFile("./LICENSE", "npm/LICENSE");
    await Deno.copyFile("./README.md", "npm/README.md");
    await cleanupTypes("./npm/types");
  },
});
