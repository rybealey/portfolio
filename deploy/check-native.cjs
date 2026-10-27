// Loads each named package from the current folder and prints, one per line,
// the Linux builds to install for any whose native binary is missing. npm
// skips an optional dependency it can't install without saying why, so a
// missing binary otherwise only shows up later, mid-build or mid-request.
//
//   node deploy/check-native.cjs lightningcss @resvg/resvg-js sharp
const fs = require('node:fs');
const path = require('node:path');

const arch = process.arch;
const missing = [];

for (const name of process.argv.slice(2)) {
  try {
    require(require.resolve(name, { paths: [process.cwd()] }));
  } catch (error) {
    console.error(`check-native: ${name} failed to load: ${error.message.split('\n')[0]}`);
    const manifest = JSON.parse(
      fs.readFileSync(path.join(process.cwd(), 'node_modules', name, 'package.json'), 'utf8'),
    );
    // The glibc builds: lightningcss-linux-x64-gnu, @img/sharp-linux-x64 and
    // @img/sharp-libvips-linux-x64, but not the musl ones.
    for (const [dep, version] of Object.entries(manifest.optionalDependencies ?? {})) {
      if (dep.includes(`linux-${arch}`) && !dep.includes('musl')) missing.push(`${dep}@${version}`);
    }
  }
}

console.log(missing.join('\n'));
