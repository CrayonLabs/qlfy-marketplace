import { readFileSync } from "node:fs";

import { pageMessage } from "./page-message.mjs";

const readInput = () => {
  try {
    return JSON.parse(readFileSync(0, "utf8"));
  } catch {
    return null;
  }
};

const message = pageMessage(readInput());
if (message) process.stdout.write(JSON.stringify(message));
