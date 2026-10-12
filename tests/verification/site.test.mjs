import assert from "node:assert/strict";
import { execFile, spawn } from "node:child_process";
import { once } from "node:events";
import { mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { createServer } from "node:http";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { setTimeout as delay } from "node:timers/promises";
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

for (const [signal, exitCode] of [["SIGINT", 130], ["SIGTERM", 143]]) {
  test(`cancelling verification with ${signal} stops its production server`, async () => {
    const fixture = await mkdtemp(join(tmpdir(), "ragvidence-verifier-cancellation-"));
    let verifier;
    let serverPid;
    try {
      const directory = join(fixture, "node_modules/next/dist/bin");
      await mkdir(directory, { recursive: true });
      await writeFile(join(directory, "next"), `
        const { createServer } = require('node:http');
        const { writeFileSync } = require('node:fs');
        createServer((request, response) => {
          if (request.url === '/alive') response.end('ready');
          // Hold the verifier's first request open until it is cancelled.
        }).listen(3001, '127.0.0.1', () => {
          writeFileSync('server.pid', String(process.pid));
          console.log('Ready in 1ms');
        });
      `);
      const environment = { ...process.env };
      delete environment.RAGVIDENCE_SITE_URL;
      verifier = spawn(process.execPath, [resolve(script)], {
        cwd: fixture, env: environment, stdio: ["ignore", "pipe", "pipe"],
      });
      let errorLog = "";
      verifier.stderr.on("data", (chunk) => { errorLog += chunk; });
      verifier.stdout.resume();
      const closed = once(verifier, "close");
      for (let attempt = 0; attempt < 100; attempt += 1) {
        if (verifier.exitCode !== null) throw new Error(`Verifier exited early: ${errorLog}`);
        try {
          serverPid = Number(await readFile(join(fixture, "server.pid"), "utf8"));
          break;
        } catch (error) {
          if (error.code !== "ENOENT") throw error;
        }
        await delay(25);
      }
      assert.ok(serverPid, `Production fixture never started: ${errorLog}`);
      assert.equal(await fetch("http://127.0.0.1:3001/alive").then((response) => response.text()), "ready");
      verifier.kill(signal);
      const [code] = await closed;
      assert.equal(code, exitCode, `Cancellation should preserve the conventional ${signal} exit code`);
      await assert.rejects(fetch("http://127.0.0.1:3001/alive", { signal: AbortSignal.timeout(1000) }));
    } finally {
      verifier?.kill("SIGKILL");
      if (serverPid) {
        try { process.kill(serverPid, "SIGKILL"); } catch (error) {
          if (error.code !== "ESRCH") throw error;
        }
      }
      await rm(fixture, { recursive: true, force: true });
    }
  });
}

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
