#!/usr/bin/env node
/**
 * Post-build performance budget gate.
 * Run after `nuxt build` — fails CI when client chunks exceed gzip thresholds.
 */
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { gzipSync } from 'node:zlib'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')
const clientDir = join(root, '.output', 'public', '_nuxt')

const BUDGET_KB = {
  scroll: 200,
  vendor: 280,
  totalJs: 650,
}

function gzipSizeKb(filePath) {
  const buf = readFileSync(filePath)
  return Math.round(gzipSync(buf).length / 1024)
}

function listJsFiles(dir) {
  if (!statSync(dir, { throwIfNoEntry: false })?.isDirectory()) return []
  return readdirSync(dir)
    .filter((name) => name.endsWith('.js'))
    .map((name) => join(dir, name))
}

const files = listJsFiles(clientDir)
if (!files.length) {
  console.error('[perf-budget] No client chunks found — run `npm run build` first.')
  process.exit(1)
}

let scrollKb = 0
let vendorKb = 0
let totalKb = 0
const violations = []

for (const file of files) {
  const kb = gzipSizeKb(file)
  totalKb += kb
  const base = file.split('/').pop() ?? ''

  if (base.includes('scroll')) scrollKb += kb
  if (base.includes('vendor')) vendorKb += kb
}

if (scrollKb > BUDGET_KB.scroll) {
  violations.push(`scroll chunk gzip ${scrollKb}KB > ${BUDGET_KB.scroll}KB`)
}
if (vendorKb > BUDGET_KB.vendor) {
  violations.push(`vendor chunk gzip ${vendorKb}KB > ${BUDGET_KB.vendor}KB`)
}
if (totalKb > BUDGET_KB.totalJs) {
  violations.push(`total JS gzip ${totalKb}KB > ${BUDGET_KB.totalJs}KB`)
}

console.info(`[perf-budget] scroll=${scrollKb}KB vendor=${vendorKb}KB total=${totalKb}KB`)

if (violations.length) {
  console.error('[perf-budget] FAILED:\n' + violations.map((v) => `  - ${v}`).join('\n'))
  process.exit(1)
}

console.info('[perf-budget] OK')
