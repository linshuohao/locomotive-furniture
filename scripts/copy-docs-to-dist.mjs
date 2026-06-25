import { cpSync, existsSync, mkdirSync, rmSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const docsDist = join(root, 'docs/.vitepress/dist')
const target = join(root, 'dist/docs')

if (!existsSync(docsDist)) {
  console.error('[copy-docs] Missing VitePress output:', docsDist)
  console.error('[copy-docs] Run: npm run docs:build')
  process.exit(1)
}

if (!existsSync(join(root, 'dist'))) {
  mkdirSync(join(root, 'dist'), { recursive: true })
}

rmSync(target, { recursive: true, force: true })
cpSync(docsDist, target, { recursive: true })
console.log('[copy-docs] Copied VitePress → dist/docs/')
