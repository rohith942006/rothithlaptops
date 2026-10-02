// Downloads every real product photo listed in lib/products.ts into
// public/products/<product-id>/ and records them in lib/image-manifest.json.
// After this runs, the website shows the local copies (fast, and they never break).
//
// Run it with:   npm run images
import { mkdir, readFile, writeFile, rm } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1")), "..");
const src = await readFile(path.join(root, "lib", "products.ts"), "utf8");

// Pull id + gallery out of the products file
const items = [];
const re = /id:\s*"([^"]+)",\s*\n\s*image:\s*("[^"]*"),\s*\n\s*gallery:\s*(\[[^\]]*\])/g;
let m;
while ((m = re.exec(src))) items.push({ id: m[1], gallery: JSON.parse(m[3]) });

const extFor = (type, url) => {
  if (/png/i.test(type)) return "png";
  if (/webp/i.test(type)) return "webp";
  if (/avif/i.test(type)) return "avif";
  if (/jpe?g/i.test(type)) return "jpg";
  const m = url.split("?")[0].match(/\.(png|jpe?g|webp|avif)$/i);
  return m ? m[1].toLowerCase().replace("jpeg", "jpg") : "jpg";
};

const headers = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36",
  Accept: "image/avif,image/webp,image/png,image/jpeg,image/*;q=0.8",
};

const manifest = {};
const failed = [];
let ok = 0;

console.log(`\nDownloading real product photos for ${items.length} products...\n`);

for (const item of items) {
  const dir = path.join(root, "public", "products", item.id);
  if (existsSync(dir)) await rm(dir, { recursive: true, force: true });
  await mkdir(dir, { recursive: true });
  manifest[item.id] = [];
  for (let i = 0; i < item.gallery.length; i++) {
    const url = item.gallery[i];
    try {
      const res = await fetch(url, { headers, redirect: "follow", signal: AbortSignal.timeout(25000) });
      const type = res.headers.get("content-type") || "";
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      if (!type.startsWith("image/")) throw new Error(`not an image (${type || "unknown"})`);
      const buf = Buffer.from(await res.arrayBuffer());
      if (buf.length < 3000) throw new Error("file too small");
      const name = `${i + 1}.${extFor(type, url)}`;
      await writeFile(path.join(dir, name), buf);
      manifest[item.id][i] = `/products/${item.id}/${name}`;
      ok++;
      console.log(`  ✔ ${item.id} — photo ${i + 1}`);
    } catch (e) {
      manifest[item.id][i] = null;
      failed.push(`${item.id} — photo ${i + 1}: ${e.message}`);
      console.log(`  ✖ ${item.id} — photo ${i + 1} (${e.message})`);
    }
  }
}

await writeFile(path.join(root, "lib", "image-manifest.json"), JSON.stringify(manifest, null, 2) + "\n");

console.log(`\nDone: ${ok} photos saved to public/products.`);
if (failed.length) {
  console.log(`\n${failed.length} photo(s) could not be downloaded:`);
  failed.forEach((f) => console.log("  - " + f));
  console.log(
    "\nThe website will try the online link for these, and show a clean\n" +
      '"Image coming soon" placeholder if that fails too. You can also save your\n' +
      "own photo into public/products/<product-id>/ and add its path in\n" +
      "lib/image-manifest.json."
  );
}
