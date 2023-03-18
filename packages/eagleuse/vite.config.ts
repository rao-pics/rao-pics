import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import { viteStaticCopy } from "vite-plugin-static-copy";

export default defineConfig({
  plugins: [
    dts({
      // 是否跳过类型诊断
      skipDiagnostics: true,
      insertTypesEntry: true,
    }),
    viteStaticCopy({
      targets: [
        {
          src: "node_modules/@eagleuse/prisma-client/prisma",
          dest: "../",
        },
      ],
    }),
  ],
  build: {
    target: "es2020",
    lib: {
      entry: "lib/index.ts",
      name: "EagleUse",
      fileName: (_format, name) => {
        if (name.endsWith("start")) {
          return "start.js";
        }

        return name + ".js";
      },
      formats: ["cjs"],
    },
    sourcemap: "inline",
    rollupOptions: {
      // 确保外部化处理那些你不想打包进库的依赖
      external: [
        "dotenv-flow",
        "@eagleuse/plugin-nsfw",
        "@eagleuse/prisma-client",
        "@eagleuse/transform-eagle",
        "@eagleuse/plugin-api",
      ],
      output: {
        // 在 UMD 构建模式下为这些外部化的依赖提供一个全局变量
        globals: {
          "@eagleuse/plugin-nsfw": "NSFW",
          "@eagleuse/prisma-client": "PrismaClient",
          "@eagleuse/transform-eagle": "TransformEagle",
          "@eagleuse/plugin-api": "API",
          "dotenv-flow": "dotenv",
        },
      },
    },
  },
});
