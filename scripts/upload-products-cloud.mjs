/**
 * Uploads generated product photos to the CLOUD Supabase project and upserts
 * all products with their image URLs — through the same authorization path
 * the app uses (anon key + upsert_product RPC with an active admin operator).
 *
 * Usage:
 *   CLOUD_SUPABASE_URL=https://<ref>.supabase.co \
 *   CLOUD_SUPABASE_ANON_KEY=eyJ... \
 *   node scripts/upload-products-cloud.mjs [--dry-run] [--only id1,id2]
 *
 * Deliberately uses CLOUD_-prefixed vars so the local-stack keys in .env.local
 * can never be hit by accident.
 */

import { readFile, access } from "node:fs/promises"
import { readFileSync } from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { products } from "./product-photos.config.mjs"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const IMAGES_DIR = path.join(root, "generated-images")
const BUCKET = "product-images"

// --local targets the local stack using the keys already in .env.local
// (needed after every `supabase db reset`, which re-seeds products without images)
const useLocal = process.argv.includes("--local")

function readEnvLocal(name) {
  try {
    const envFile = readFileSync(path.join(root, ".env.local"), "utf8")
    return envFile.match(new RegExp(`^${name}=(.+)$`, "m"))?.[1]?.trim() ?? null
  } catch {
    return null
  }
}

const SUPABASE_URL = (
  useLocal ? readEnvLocal("NEXT_PUBLIC_SUPABASE_URL") : process.env.CLOUD_SUPABASE_URL
)?.replace(/\/$/, "")
const ANON_KEY = useLocal
  ? readEnvLocal("NEXT_PUBLIC_SUPABASE_ANON_KEY")
  : process.env.CLOUD_SUPABASE_ANON_KEY

if (!SUPABASE_URL || !ANON_KEY) {
  console.error(
    useLocal
      ? "Could not read NEXT_PUBLIC_SUPABASE_* from .env.local — run `pnpm supabase:env-sync` first."
      : "Set CLOUD_SUPABASE_URL and CLOUD_SUPABASE_ANON_KEY (cloud project), or pass --local for the local stack."
  )
  process.exit(1)
}

if (useLocal && !SUPABASE_URL.includes("127.0.0.1") && !SUPABASE_URL.includes("localhost")) {
  console.error(`--local was passed but .env.local points at ${SUPABASE_URL} — refusing.`)
  process.exit(1)
}

const dryRun = process.argv.includes("--dry-run")
const onlyArg = process.argv.includes("--only")
  ? process.argv[process.argv.indexOf("--only") + 1]?.split(",").map((s) => s.trim())
  : null

const headers = {
  apikey: ANON_KEY,
  Authorization: `Bearer ${ANON_KEY}`,
}

async function rpc(name, body) {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/${name}`, {
    method: "POST",
    headers: { ...headers, "Content-Type": "application/json" },
    body: JSON.stringify(body ?? {}),
  })
  const text = await response.text()
  if (!response.ok) {
    throw new Error(`rpc ${name} → ${response.status}: ${text.slice(0, 300)}`)
  }
  return text ? JSON.parse(text) : null
}

async function findAdminOperator() {
  const operators = await rpc("list_active_operators")
  const admin = operators?.find((op) => op.role === "admin")
  if (!admin) {
    throw new Error(
      "No active admin operator found in the cloud project — create one in the operators table first."
    )
  }
  return admin
}

async function uploadImage(productId) {
  const file = path.join(IMAGES_DIR, `${productId}.webp`)
  try {
    await access(file)
  } catch {
    return null // no generated image for this product
  }
  const bytes = await readFile(file)
  const objectPath = `${productId}/${Date.now()}.webp`
  const response = await fetch(
    `${SUPABASE_URL}/storage/v1/object/${BUCKET}/${objectPath}`,
    {
      method: "POST",
      headers: { ...headers, "Content-Type": "image/webp", "x-upsert": "true" },
      body: bytes,
    }
  )
  if (!response.ok) {
    const text = await response.text()
    throw new Error(`storage upload → ${response.status}: ${text.slice(0, 300)}`)
  }
  return `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${objectPath}`
}

async function main() {
  const queue = products.filter((p) => !onlyArg || onlyArg.includes(p.id))
  console.log(`Target: ${SUPABASE_URL}`)
  console.log(`Products: ${queue.length}${dryRun ? " (dry run — no writes)" : ""}\n`)

  const admin = await findAdminOperator()
  console.log(`Using admin operator: ${admin.name} (${admin.id})\n`)

  const failures = []
  let done = 0
  for (const product of queue) {
    done++
    process.stdout.write(`[${done}/${queue.length}] ${product.id} … `)
    try {
      if (dryRun) {
        console.log("dry run, skipped")
        continue
      }
      const imageUrl = await uploadImage(product.id)
      await rpc("upsert_product", {
        p_operator_id: admin.id,
        p_id: product.id,
        p_name: product.name,
        p_price: product.price,
        p_category: product.category,
        p_description: product.description ?? undefined,
        ...(imageUrl ? { p_image_url: imageUrl } : {}),
      })
      console.log(imageUrl ? "image + product ok" : "product ok (no image found)")
    } catch (error) {
      console.log("FAILED")
      console.error(`    ${error.message}`)
      failures.push(product.id)
    }
  }

  if (failures.length > 0) {
    console.error(
      `\n${failures.length} product(s) failed: ${failures.join(", ")}\nRe-run with: node scripts/upload-products-cloud.mjs --only ${failures.join(",")}`
    )
    process.exit(1)
  }
  console.log("\nAll products upserted in the cloud project.")
}

main().catch((error) => {
  console.error(error.message)
  process.exit(1)
})
