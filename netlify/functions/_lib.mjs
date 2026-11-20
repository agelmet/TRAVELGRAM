/* Shared helpers for the Travelgram panel functions.
   Edits are stored in Netlify Blobs: they show on the site at once and NEVER trigger a deploy (0 credits). */
import { getStore } from "@netlify/blobs";
// The live passcode lives ONLY in the site's environment variable ADMIN_PASS (never in this public repo).
// Without it the panel refuses every login, so nobody can guess it from the code.
export const content = () => getStore({ name: "travelgram-content", consistency: "strong" });
export const images = () => getStore("travelgram-images");
export const json = (body, status = 200) => new Response(JSON.stringify(body), {
  status, headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" } });
async function sha256(t) {
  const b = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(t));
  return Array.from(new Uint8Array(b)).map((x) => x.toString(16).padStart(2, "0")).join("");
}
export async function checkPass(p) {
  if (typeof p !== "string" || !p) return false;
  const want = process.env.ADMIN_PASS;
  const ok = !!want && want.length >= 6 && (await sha256(p)) === (await sha256(want));
  if (!ok) await new Promise((r) => setTimeout(r, 700)); // slow down guessing
  return ok;
}
