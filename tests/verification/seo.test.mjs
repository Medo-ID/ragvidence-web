import assert from "node:assert/strict";
import test from "node:test";
import { serializeJsonLd } from "../../src/lib/seo.ts";

test("structured data cannot close its script element while retaining exact text", () => {
  const data = { name: '</script><script>alert("dataset")</script>', description: "Evidence < target & source > result" };
  const serialized = serializeJsonLd(data);
  assert.equal(serialized.includes("<"), false);
  assert.deepEqual(JSON.parse(serialized), data);
});
