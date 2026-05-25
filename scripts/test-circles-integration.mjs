#!/usr/bin/env node
/**
 * Smoke test Circles SDK integration (read-only, no private key).
 *   npm run test:circles
 */
import { Sdk } from "@aboutcircles/sdk";

const GNOSIS_GROUP = "0xc19bc204eb1c1d5b3fe500e5e5dfabab625f286c";
const checks = [];

function pass(label) {
  checks.push({ label, ok: true });
  console.log(`✅ ${label}`);
}

function fail(label, err) {
  checks.push({ label, ok: false });
  console.error(`❌ ${label}:`, err instanceof Error ? err.message : err);
}

const sdk = new Sdk();

try {
  const rels = await sdk.data.getTrustRelations(GNOSIS_GROUP);
  pass(`getTrustRelations (${rels.length} rows)`);
} catch (err) {
  fail("getTrustRelations", err);
}

try {
  const view = await sdk.rpc.sdk.getProfileView(GNOSIS_GROUP);
  pass(`getProfileView (${view.profile?.name ?? "Gnosis Group"})`);
} catch (err) {
  fail("getProfileView", err);
}

try {
  const res = await fetch(
    "https://squid-app-3gxnl.ondigitalocean.app/aboutcircles-advanced-analytics2/scoring/relative_trustscore/generic",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        avatars: [GNOSIS_GROUP],
        target_set: [GNOSIS_GROUP],
        include_details: false,
      }),
    },
  );
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  pass("trust analytics API");
} catch (err) {
  fail("trust analytics API", err);
}

const group = process.env.HIST_GROUP;
if (group?.startsWith("0x")) {
  try {
    await sdk.groups.getCollateral(group);
    pass("HIST group collateral");
  } catch (err) {
    fail("HIST group collateral", err);
  }
} else {
  console.log("ℹ️  Skip HIST group (set HIST_GROUP=0x… to test)");
}

const failed = checks.filter((c) => !c.ok).length;
console.log(failed === 0 ? "\nAll checks passed." : `\n${failed} check(s) failed.`);
process.exit(failed === 0 ? 0 : 1);
