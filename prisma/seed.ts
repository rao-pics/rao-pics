import { getPrisma } from "@/lib/prisma";
import logger from "@/utils/logger";
import * as dotenv from "dotenv";
import { readFileSync, writeFileSync } from "fs-extra";
import { join } from "path";
import { initImage } from "./seed/image";
import { initMetadata } from "./seed/metadata";
import initNSFW from "./seed/nsfw";

const prisma = getPrisma();

dotenv.config({
  path: join(__dirname, `../.env.${process.env.NODE_ENV || "development"}`),
});
function debounce(func, timeout = 300) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, timeout);
  };
}

// 触发 eagleuse 让fs.watch能监听到
const triggerChangeDb = debounce(() => {
  const file = process.env.LIBRARY + "/eagleuse.db";
  const content = readFileSync(file);
  writeFileSync(file, content);
  logger.info("Trigger file update");
}, 10000);

function main() {
  initImage(prisma, triggerChangeDb, {
    success: () => {
      initMetadata(prisma, triggerChangeDb);
      initNSFW(prisma, triggerChangeDb);
    },
  });
}

main();
