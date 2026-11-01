import { readFileSync, writeFileSync } from 'fs'

const files = [
  'src/App.tsx',
  'src/pages/Instalacions.tsx',
  'src/pages/Jardineria.tsx',
  'src/pages/Manteniment.tsx',
  'src/pages/Piscines.tsx',
]

for (const f of files) {
  let src = readFileSync(f, 'utf8')

  // Extract the WhatsApp navLink line (starts with '    { label: 'WhatsApp'')
  const waMatch = src.match(/^\s*\{ label: 'WhatsApp', href: waHeader, external: true, icon: <svg[\s\S]*?\/svg>\s*\},\n/m)
  if (!waMatch) {
    console.log(`NO WA FOUND in ${f}`)
    continue
  }

  const waLine = waMatch[0]
  // Remove it from current position (first)
  src = src.replace(waLine, '')

  // Find the closing of navLinks array: the line '  ]' after 'const navLinks'
  const navStartIdx = src.indexOf('const navLinks')
  const navEndIdx = src.indexOf('  ]', navStartIdx)

  // Insert waLine before the closing '  ]'
  src = src.slice(0, navEndIdx) + waLine + src.slice(navEndIdx)

  writeFileSync(f, src)
  console.log(`MOVED WA to end in ${f}`)
}

console.log('Done!')