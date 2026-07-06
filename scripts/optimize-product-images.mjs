/**
 * Optimize the full-resolution product renders in `generated-images/` (1024²
 * webp, ~1 MB each) into small, display-sized assets bundled with the app at
 * `public/products/<id>.webp` (512² webp, ~20 KB each).
 *
 * In local mode the app has no image host, so these static files ARE the
 * product photos. Cards display them at ≤220 px, so 512² covers retina.
 *
 * Source images stay gitignored; the optimized `public/products/` set is
 * committed. Requires ImageMagick (`convert`) on PATH.
 *
 *   node scripts/optimize-product-images.mjs
 */
import { readdir, mkdir, access } from "node:fs/promises"
import { execFile } from "node:child_process"
import { promisify } from "node:util"
import path from "node:path"

const run = promisify(execFile)
const SRC_DIR = "generated-images"
const OUT_DIR = path.join("public", "products")
const SIZE = 512
const QUALITY = 80

async function main() {
  try {
    await access(SRC_DIR)
  } catch {
    console.error(`Source dir "${SRC_DIR}" not found. Run \`pnpm photos:generate\` first.`)
    process.exit(1)
  }
  await mkdir(OUT_DIR, { recursive: true })

  const files = (await readdir(SRC_DIR)).filter((f) => f.endsWith(".webp"))
  if (files.length === 0) {
    console.error(`No .webp files in "${SRC_DIR}".`)
    process.exit(1)
  }

  let done = 0
  for (const file of files) {
    const src = path.join(SRC_DIR, file)
    const out = path.join(OUT_DIR, file)
    await run("convert", [src, "-resize", `${SIZE}x${SIZE}`, "-quality", String(QUALITY), out])
    done++
    console.log(`[${done}/${files.length}] ${file}`)
  }
  console.log(`\nWrote ${done} images to ${OUT_DIR}/ (${SIZE}px, q${QUALITY}).`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
