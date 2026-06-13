/**
 * Generates one consistent photo per product with OpenAI gpt-image-1.
 *
 * Usage:
 *   OPENAI_API_KEY=sk-... node scripts/generate-product-images.mjs [--only id1,id2] [--force] [--quality medium|high]
 *
 * The key is read from the environment or from OPENAI_API_KEY in .env.local.
 * Images are written to generated-images/<product-id>.webp (1024x1024).
 * Already-generated images are skipped unless --force is passed.
 */

import { mkdir, readFile, writeFile, access } from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { PHOTO_STYLE_TEMPLATE, products } from "./product-photos.config.mjs"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const OUT_DIR = path.join(root, "generated-images")

async function loadApiKey() {
  if (process.env.OPENAI_API_KEY) return process.env.OPENAI_API_KEY
  try {
    const envFile = await readFile(path.join(root, ".env.local"), "utf8")
    const match = envFile.match(/^OPENAI_API_KEY=(.+)$/m)
    if (match) return match[1].trim()
  } catch {
    /* no .env.local */
  }
  return null
}

function parseArgs() {
  const args = process.argv.slice(2)
  const only = args.includes("--only")
    ? args[args.indexOf("--only") + 1]?.split(",").map((s) => s.trim()) ?? []
    : null
  const force = args.includes("--force")
  const quality = args.includes("--quality")
    ? args[args.indexOf("--quality") + 1]
    : "medium"
  return { only, force, quality }
}

async function fileExists(file) {
  try {
    await access(file)
    return true
  } catch {
    return false
  }
}

async function generateImage(apiKey, prompt, quality, attempt = 1) {
  const response = await fetch("https://api.openai.com/v1/images/generations", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-image-1",
      prompt,
      size: "1024x1024",
      quality,
      output_format: "webp",
      n: 1,
    }),
  })

  if (response.status === 429 && attempt <= 5) {
    const waitS = Math.min(60, 5 * attempt)
    console.log(`  rate limited — waiting ${waitS}s (attempt ${attempt}/5)`)
    await new Promise((r) => setTimeout(r, waitS * 1000))
    return generateImage(apiKey, prompt, quality, attempt + 1)
  }

  if (!response.ok) {
    const body = await response.text()
    throw new Error(`OpenAI API ${response.status}: ${body.slice(0, 400)}`)
  }

  const payload = await response.json()
  const b64 = payload.data?.[0]?.b64_json
  if (!b64) throw new Error("Response contained no image data")
  return Buffer.from(b64, "base64")
}

async function main() {
  const apiKey = await loadApiKey()
  if (!apiKey) {
    console.error(
      "Missing OPENAI_API_KEY. Export it or add `OPENAI_API_KEY=sk-...` to .env.local (gitignored)."
    )
    process.exit(1)
  }

  const { only, force, quality } = parseArgs()
  const queue = products.filter((p) => !only || only.includes(p.id))
  if (queue.length === 0) {
    console.error("No products matched --only filter.")
    process.exit(1)
  }

  await mkdir(OUT_DIR, { recursive: true })
  console.log(`Generating ${queue.length} image(s) at quality "${quality}" → ${OUT_DIR}\n`)

  const failures = []
  let done = 0
  for (const product of queue) {
    const outFile = path.join(OUT_DIR, `${product.id}.webp`)
    done++
    if (!force && (await fileExists(outFile))) {
      console.log(`[${done}/${queue.length}] ${product.id} — exists, skipping`)
      continue
    }
    process.stdout.write(`[${done}/${queue.length}] ${product.id} … `)
    try {
      const image = await generateImage(apiKey, PHOTO_STYLE_TEMPLATE(product.subject), quality)
      await writeFile(outFile, image)
      console.log(`ok (${Math.round(image.length / 1024)} KB)`)
    } catch (error) {
      console.log("FAILED")
      console.error(`    ${error.message}`)
      failures.push(product.id)
    }
  }

  if (failures.length > 0) {
    console.error(
      `\n${failures.length} image(s) failed: ${failures.join(", ")}\nRe-run with: node scripts/generate-product-images.mjs --only ${failures.join(",")}`
    )
    process.exit(1)
  }
  console.log("\nAll images generated.")
}

main()
