const builder = require("electron-builder");

const { resolve, join } = require("path");

const isDev = process.env.NODE_ENV === "development";

/**
 * @type {import('electron-builder').Configuration}
 * @see https://www.electron.build/configuration/configuration
 */
const options = {
  appId: "com.rao-pics.app",
  productName: "electron",
  directories: {
    buildResources: "build",
  },
  asar: !isDev,
  files: [
    "!**/.vscode/*",
    "!src/*",
    "!electron.vite.config.{js,ts,mjs,cjs}",
    "!{.eslintignore,.eslintrc.json,.prettierignore,.prettierrc.yaml,dev-app-update.yml,CHANGELOG.md,README.md,tailwind.config.ts,postcss.config.cjs,electron-builder.cjs}",
    "!{.env,.env.*,.npmrc,pnpm-lock.yaml}",
    "!{tsconfig.json,tsconfig.node.json,tsconfig.web.json}",
    "!**/node_modules/@rao-pics/**",
    "!**/.turbo/*",
    "!**/node_modules/prisma/libquery_engine-*",
    "!**/node_modules/@prisma/engines/**",
    {
      from: resolve(__dirname, "../../node_modules/.prisma"),
      to: "node_modules/.prisma",
    },
  ],
  asarUnpack: ["resources/**/*"],
  afterSign: "build/notarize.js",
  mac: {
    entitlementsInherit: "build/entitlements.mac.plist",
    target: isDev ? "dir" : { target: "dmg", arch: ["arm64", "x64"] },
  },
  // win: {
  //   target: isDev ? "dir" : { target: "nsis", arch: ["x64"] },
  // },
  npmRebuild: false,
  publish: {
    provider: "generic",
    url: "https://example.com/auto-updates",
  },
  extraResources: [
    {
      from: resolve(__dirname, "./node_modules/@rao-pics/db/prisma/db.sqlite"),
      to: "extraResources/db.sqlite",
    },
    {
      from: join(__dirname, "../../themes/tiga/.next"),
      to: "themes/tiga",
      filter: ["standalone/**/*", "public/**/*", "static/**/*"],
    },
  ],
};

builder
  .build({
    targets: builder.Platform.MAC.createTarget(),
    config: options,
  })
  .then((result) => {
    console.log(JSON.stringify(result));
  })
  .catch((error) => {
    console.error(error);
  });
