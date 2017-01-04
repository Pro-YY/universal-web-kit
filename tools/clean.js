import { cleanDir } from './lib/shutils'

/**
 * Cleans up output (build) directory
 */

function clean() {
  return Promise.all([
    cleanDir('build/*', {
      nosort: true,
      dot: true,
      ignore: ['build/public'],
    }),
    cleanDir('build/public/*', {
      nosort: true,
      dot: true,
      ignore: [],
    }),
  ])
}

export default clean
