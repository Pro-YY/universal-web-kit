import path from 'path'
import chokidar from 'chokidar'
import { writeFile, copyFile, makeDir, copyDir, cleanDir } from './lib/shutils'
import pkg from '../package.json'
import { format } from './run'

/**
 * Copies static files such as robots.txt, favicon.ico to the
 * output (build) folder.
 */
async function copy() {
  await makeDir('build')
  await Promise.all([
    writeFile('build/package.json', JSON.stringify({
      private: true,
      engines: pkg.engines,
      dependencies: pkg.dependencies,
      scripts: {
        start: 'node server.main.bundle.js',
      },
    }, null, 2)),
    copyFile('LICENSE', 'build/LICENSE'),
    copyDir('source/content', 'build/content'),
    copyDir('source/public', 'build/public'),
  ])

  if (process.argv.includes('--watch')) {
    const watcher = chokidar.watch([
      'source/content/**/*',
      'source/public/**/*',
    ], { ignoreInitial: true })

    watcher.on('all', async (event, filePath) => {
      const start = new Date()
      const src = path.relative('./', filePath)
      const dist = path.join('build/', src.startsWith('source') ? path.relative('source', src) : src)
      switch (event) {
        case 'add':
        case 'change':
          await makeDir(path.dirname(dist))
          await copyFile(filePath, dist)
          break
        case 'unlink':
        case 'unlinkDir':
          cleanDir(dist, { nosort: true, dot: true })
          break
        default:
          return
      }
      const end = new Date()
      const time = end.getTime() - start.getTime()
      console.log(`[${format(end)}] ${event} '${dist}' after ${time} ms`)
    })
  }
}

export default copy
