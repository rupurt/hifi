import { spawn } from 'node:child_process'
import { mkdir, mkdtemp, readdir, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const workspaceRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const pnpmStore = await runForOutput('pnpm', ['store', 'path'], workspaceRoot)
const temporaryRoot = await mkdtemp(join(tmpdir(), 'hifi-package-consumer-'))
const packDirectory = join(temporaryRoot, 'packs')
const consumerDirectory = join(temporaryRoot, 'consumer')
const packageNames = ['core', 'liquid', 'texture', 'print']

try {
  await mkdir(packDirectory)
  await mkdir(join(consumerDirectory, 'src'), { recursive: true })

  await run(
    'pnpm',
    ['--filter', './packages/*', 'pack', '--pack-destination', packDirectory],
    workspaceRoot,
  )

  const archiveNames = await readdir(packDirectory)
  const archives = Object.fromEntries(
    packageNames.map((name) => {
      const archiveName = archiveNames.find((candidate) => candidate.startsWith(`hifi-${name}-`))

      if (!archiveName) {
        throw new Error(`Missing packed archive for @hifi/${name}`)
      }

      return [`@hifi/${name}`, join(packDirectory, archiveName)]
    }),
  )

  const rootManifest = JSON.parse(await readFile(join(workspaceRoot, 'package.json'), 'utf8'))
  const styleguideManifest = JSON.parse(
    await readFile(join(workspaceRoot, 'apps/styleguide/package.json'), 'utf8'),
  )
  const packageManifests = Object.fromEntries(
    await Promise.all(
      packageNames.map(async (name) => [
        `@hifi/${name}`,
        JSON.parse(await readFile(join(workspaceRoot, `packages/${name}/package.json`), 'utf8')),
      ]),
    ),
  )
  const releaseVersions = new Set(
    Object.values(packageManifests).map((manifest) => manifest.version),
  )

  if (releaseVersions.size !== 1 || releaseVersions.has('0.0.0')) {
    throw new Error('The @hifi packages must share one non-placeholder release version')
  }

  for (const [name, manifest] of Object.entries(packageManifests)) {
    if (manifest.private === true || manifest.publishConfig?.access !== 'public') {
      throw new Error(`${name} is not configured as a public package`)
    }
  }

  await writeJson(join(consumerDirectory, 'package.json'), {
    name: 'hifi-package-consumer',
    private: true,
    type: 'module',
    scripts: {
      typecheck: 'tsc --noEmit',
      verify: 'node verify.mjs',
    },
    dependencies: {
      '@hifi/core': `file:${archives['@hifi/core']}`,
      '@hifi/liquid': `file:${archives['@hifi/liquid']}`,
      '@hifi/print': `file:${archives['@hifi/print']}`,
      '@hifi/texture': `file:${archives['@hifi/texture']}`,
      react: styleguideManifest.dependencies.react,
      'react-dom': styleguideManifest.dependencies['react-dom'],
    },
    devDependencies: {
      '@types/react': rootManifest.devDependencies['@types/react'],
      '@types/react-dom': rootManifest.devDependencies['@types/react-dom'],
      typescript: rootManifest.devDependencies.typescript,
    },
  })

  await writeFile(
    join(consumerDirectory, 'pnpm-workspace.yaml'),
    `packages:\n  - .\noverrides:\n  '@hifi/core': 'file:${archives['@hifi/core']}'\n`,
  )

  await writeJson(join(consumerDirectory, 'tsconfig.json'), {
    compilerOptions: {
      esModuleInterop: true,
      forceConsistentCasingInFileNames: true,
      jsx: 'react-jsx',
      lib: ['ES2023', 'DOM', 'DOM.Iterable'],
      module: 'ESNext',
      moduleResolution: 'Bundler',
      noEmit: true,
      skipLibCheck: false,
      strict: true,
      target: 'ES2023',
    },
    include: ['src'],
  })

  await writeFile(
    join(consumerDirectory, 'index.html'),
    '<!doctype html><html><body><div id="root"></div><script type="module" src="/src/main.tsx"></script></body></html>\n',
  )

  await writeFile(
    join(consumerDirectory, 'src/main.tsx'),
    `import { LiquidSurface, liquidThemeMaterials } from '@hifi/liquid'
import { PrintSurface, printThemeMaterials } from '@hifi/print'
import { TextureSurface, textureThemeMaterials } from '@hifi/texture'
import { createRoot } from 'react-dom/client'

const root = document.querySelector<HTMLDivElement>('#root')

if (!root) throw new Error('Missing consumer root')

createRoot(root).render(
  <main>
    <LiquidSurface material={liquidThemeMaterials.clear}>Liquid</LiquidSurface>
    <TextureSurface material={textureThemeMaterials.paper}>Texture</TextureSurface>
    <PrintSurface material={printThemeMaterials.broadsheet}>Print</PrintSurface>
  </main>,
)
`,
  )

  await writeFile(
    join(consumerDirectory, 'verify.mjs'),
    `import assert from 'node:assert/strict'
import { defineGrammar } from '@hifi/core'
import {
  LiquidSurface,
  liquidThemeMaterials,
  parseLiquidMaterial,
  serializeLiquidMaterial,
} from '@hifi/liquid'
import { liquidGrammar as liquidGrammarEntry } from '@hifi/liquid/grammar'
import {
  PrintSurface,
  parsePrintMaterial,
  printThemeMaterials,
  serializePrintMaterial,
} from '@hifi/print'
import { printGrammar as printGrammarEntry } from '@hifi/print/grammar'
import {
  TextureSurface,
  parseTextureMaterial,
  serializeTextureMaterial,
  textureThemeMaterials,
} from '@hifi/texture'
import { textureGrammar as textureGrammarEntry } from '@hifi/texture/grammar'

assert.equal(typeof defineGrammar, 'function')
assert.equal(typeof LiquidSurface, 'function')
assert.equal(typeof TextureSurface, 'function')
assert.equal(typeof PrintSurface, 'function')
assert.equal(liquidGrammarEntry.name, 'liquid')
assert.equal(textureGrammarEntry.name, 'texture')
assert.equal(printGrammarEntry.name, 'print')
assert.deepEqual(
  parseLiquidMaterial(JSON.parse(serializeLiquidMaterial(liquidThemeMaterials.clear))),
  liquidThemeMaterials.clear,
)
assert.deepEqual(
  parseTextureMaterial(JSON.parse(serializeTextureMaterial(textureThemeMaterials.paper))),
  textureThemeMaterials.paper,
)
assert.deepEqual(
  parsePrintMaterial(JSON.parse(serializePrintMaterial(printThemeMaterials.broadsheet))),
  printThemeMaterials.broadsheet,
)
`,
  )

  await run('pnpm', ['install', '--offline', '--store-dir', pnpmStore.trim()], consumerDirectory)

  const releaseVersion = [...releaseVersions][0]
  for (const name of packageNames) {
    const installedPackageRoot = join(consumerDirectory, `node_modules/@hifi/${name}`)
    const installedManifest = JSON.parse(
      await readFile(join(installedPackageRoot, 'package.json'), 'utf8'),
    )

    await readFile(join(installedPackageRoot, 'README.md'), 'utf8')

    if (installedManifest.version !== releaseVersion) {
      throw new Error(`@hifi/${name} packed an unexpected version`)
    }

    if (
      name !== 'core' &&
      installedManifest.dependencies?.['@hifi/core'] !== `^${releaseVersion}`
    ) {
      throw new Error(`@hifi/${name} did not pack a coordinated @hifi/core range`)
    }
  }

  await run('pnpm', ['run', 'typecheck'], consumerDirectory)
  await run('pnpm', ['run', 'verify'], consumerDirectory)
  await run(
    join(workspaceRoot, 'apps/styleguide/node_modules/.bin/vite'),
    ['build'],
    consumerDirectory,
  )

  process.stdout.write('Packed package consumer passed Node, TypeScript, and Vite checks.\n')
} finally {
  await rm(temporaryRoot, { force: true, recursive: true })
}

async function writeJson(path, value) {
  await writeFile(path, `${JSON.stringify(value, null, 2)}\n`)
}

async function run(command, args, cwd) {
  await new Promise((resolvePromise, rejectPromise) => {
    const child = spawn(command, args, { cwd, stdio: 'inherit' })

    child.on('error', rejectPromise)
    child.on('exit', (code, signal) => {
      if (code === 0) {
        resolvePromise()
        return
      }

      rejectPromise(
        new Error(`${command} ${args.join(' ')} failed with ${signal ?? `exit code ${code}`}`),
      )
    })
  })
}

async function runForOutput(command, args, cwd) {
  return await new Promise((resolvePromise, rejectPromise) => {
    const child = spawn(command, args, { cwd, stdio: ['ignore', 'pipe', 'inherit'] })
    let output = ''

    child.stdout.setEncoding('utf8')
    child.stdout.on('data', (chunk) => {
      output += chunk
    })
    child.on('error', rejectPromise)
    child.on('exit', (code, signal) => {
      if (code === 0) {
        resolvePromise(output)
        return
      }

      rejectPromise(
        new Error(`${command} ${args.join(' ')} failed with ${signal ?? `exit code ${code}`}`),
      )
    })
  })
}
