import { rm } from 'node:fs/promises'
import { dirname, relative, resolve, sep } from 'node:path'
import { fileURLToPath } from 'node:url'

const workspaceRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const packagesRoot = resolve(workspaceRoot, 'packages')
const packageRoot = resolve(process.cwd())
const packagePath = relative(packagesRoot, packageRoot)
const distPath = resolve(packageRoot, 'dist')

if (
  packagePath.length === 0 ||
  packagePath.startsWith(`..${sep}`) ||
  packagePath === '..' ||
  packagePath.includes(sep) ||
  relative(packageRoot, distPath) !== 'dist'
) {
  throw new Error(`Refusing to clean dist outside a direct workspace package: ${packageRoot}`)
}

await rm(distPath, { force: true, recursive: true })
