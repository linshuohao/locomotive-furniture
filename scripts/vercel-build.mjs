import { execSync } from 'node:child_process'
import { cpSync, rmSync } from 'node:fs'

const project = process.env.VERCEL_PROJECT_NAME ?? ''
const isDocs = project.includes('docs')

if (isDocs) {
  execSync('npm run docs:build', { stdio: 'inherit' })
  rmSync('dist', { recursive: true, force: true })
  cpSync('docs/.vitepress/dist', 'dist', { recursive: true })
} else {
  execSync('npm run build', { stdio: 'inherit' })
}
