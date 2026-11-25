/**
 * `npm run dev`: Next dev сервер + PPTX-г автоматаар дахин үүсгэх watcher.
 * src/decks, scripts, public/images доторх файл өөрчлөгдөх бүрт
 * public/downloads/*.pptx шинэчлэгдэж, татах товч үргэлж вэбтэй ижил файл өгнө.
 */
import { spawn } from "node:child_process";

const procs = [
  spawn(
    process.execPath,
    [
      "--no-warnings",
      "--watch-path=src/decks",
      "--watch-path=scripts",
      "--watch-path=public/images",
      "scripts/build-pptx.mjs",
    ],
    { stdio: "inherit" },
  ),
  spawn("npx", ["next", "dev", ...process.argv.slice(2)], {
    stdio: "inherit",
    shell: process.platform === "win32",
  }),
];

const stop = () => {
  for (const p of procs) p.kill("SIGTERM");
  process.exit();
};
process.on("SIGINT", stop);
process.on("SIGTERM", stop);
for (const p of procs) p.on("exit", (code) => code && stop());
