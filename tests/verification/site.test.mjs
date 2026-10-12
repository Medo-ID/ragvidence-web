import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { createServer } from "node:http";
import { promisify } from "node:util";
import test from "node:test";

const run = promisify(execFile);
const script = "scripts/verify-site.mjs";

test("an unavailable explicit URL fails without falling back to a local server", async () => {
  const reservation = createServer();
  await new Promise((resolve) => reservation.listen(0, "127.0.0.1", resolve));
  const port = reservation.address().port;
  await new Promise((resolve) => reservation.close(resolve));
  await assert.rejects(
    run(process.execPath, [script], { env: { ...process.env, RAGVIDENCE_SITE_URL: `http://127.0.0.1:${port}` }, timeout: 5000 }),
    (error) => error.code === 1 && !error.killed && !error.stderr.includes("Production server"),
  );
});

test("the default gate refuses to reuse an occupied production port", async () => {
  const existing = createServer((request, response) => { response.end("An unrelated reachable site"); });
  await new Promise((resolve, reject) => {
    existing.once("error", reject);
    existing.listen(3001, "127.0.0.1", resolve);
  });
  const environment = { ...process.env };
  delete environment.RAGVIDENCE_SITE_URL;
  try {
    await assert.rejects(
      run(process.execPath, [script], { env: environment, timeout: 5000 }),
      (error) => error.code === 1 && error.stderr.includes("Production server exited") && error.stderr.includes("EADDRINUSE"),
    );
    // The verifier owns only the server it spawned, not an existing listener.
    assert.equal(await fetch("http://127.0.0.1:3001").then((response) => response.text()), "An unrelated reachable site");
  } finally {
    await new Promise((resolve) => existing.close(resolve));
  }
});
