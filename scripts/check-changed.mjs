import { execSync, spawnSync } from 'node:child_process'

const FULL_CHECK_PATTERNS = [
  /^package(-lock)?\.json$/,
  /^vitest\.config/,
  /^nuxt\.config/,
  /^eslint\.config/,
  /^tsconfig/,
  /^\.prettierrc/,
  /^scripts\//,
]

function git(cmd) {
  return execSync(`git ${cmd}`, { encoding: 'utf8' }).trim()
}

function run(cmd, args = []) {
  const label = args.length ? `${cmd} ${args.join(' ')}` : cmd
  console.log(`\n> ${label}`)
  const result = spawnSync(cmd, args, { stdio: 'inherit', shell: false })
  if (result.status !== 0) {
    process.exit(result.status ?? 1)
  }
}

function getBaseRef() {
  const pushBase = process.env.CHECK_CHANGED_BASE?.trim()
  if (pushBase) {
    return pushBase
  }

  try {
    return git('rev-parse @{upstream}')
  } catch {
    // no upstream configured
  }

  for (const branch of ['origin/main', 'origin/master', 'main', 'master']) {
    try {
      return git(`rev-parse ${branch}`)
    } catch {
      // branch may not exist locally
    }
  }

  return 'HEAD~1'
}

function getChangedFiles(base) {
  const rangeDiff = git(`diff --name-only --diff-filter=ACMR ${base}..HEAD`)
  const unstaged = git('diff --name-only --diff-filter=ACMR')
  const staged = git('diff --name-only --diff-filter=ACMR --cached')

  return [...new Set([rangeDiff, unstaged, staged].flatMap((out) => out.split('\n').filter(Boolean)))]
}

function needsFullCheck(files) {
  return files.some((file) => FULL_CHECK_PATTERNS.some((pattern) => pattern.test(file)))
}

function main() {
  const base = getBaseRef()
  const changed = getChangedFiles(base)

  const pushBase = process.env.CHECK_CHANGED_BASE?.trim()
  const baseLabel = pushBase ? `push ${base.slice(0, 7)}` : `base ${base.slice(0, 7)}`
  console.log(`Incremental check (${baseLabel}, ${changed.length} file(s))`)

  if (changed.length === 0) {
    console.log('No changes detected — skipping check')
    return
  }

  if (needsFullCheck(changed)) {
    console.log('Config or dependency changes detected — running full check')
    run('npm', ['run', 'check'])
    return
  }

  const srcChanges = changed.filter((file) => file.startsWith('src/') || file.startsWith('e2e/'))
  if (srcChanges.length === 0) {
    console.log('No src/e2e changes — skipping check')
    return
  }

  const lintTargets = changed.filter((file) => /^src\/.*\.(ts|vue)$/.test(file))
  if (lintTargets.length > 0) {
    run('npx', ['eslint', ...lintTargets])
  }

  const prettierTargets = changed.filter((file) => /\.(ts|vue|css|scss|json|md)$/.test(file))
  if (prettierTargets.length > 0) {
    run('npx', ['prettier', '--check', ...prettierTargets])
  }

  const needsTypecheck = changed.some((file) => /\.(ts|vue)$/.test(file))
  if (needsTypecheck) {
    run('npm', ['run', 'typecheck'])
  }

  const testTargets = changed.filter((file) => /^src\/.*\.(ts|vue)$/.test(file))
  if (testTargets.length > 0) {
    run('npx', [
      'vitest',
      'related',
      ...testTargets,
      '--run',
      '--passWithNoTests',
      '--config',
      'vitest.config.ts',
    ])
  } else {
    console.log('\nNo testable source changes — skipping tests')
  }

  console.log('\nIncremental check passed')
}

main()
