const fs = require('fs');

const raw = fs.readFileSync('ALL_LICENSES.txt', 'utf-8');
const lines = raw.split('\n');

const clean = lines
  .filter(line => line.includes('@') && line.includes(':') && !line.includes('node_modules'))
  .map(line => {
    const parts = line.split(':');
    return `${parts[0].trim()}: ${parts[1].trim()}`;
  });

const unique = [...new Set(clean)].sort();
fs.writeFileSync('ALL_LICENSES_cleaned.txt', unique.join('\n'), 'utf-8');

console.log('✅ ALL_LICENSES_cleaned.txt created successfully.');
