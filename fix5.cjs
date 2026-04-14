const fs = require('fs');
let code = fs.readFileSync('src/components/AsciiBackground.jsx', 'utf8');
code = code.replace(/<video([^>]*?)(?<!\/)\s*>/g, '<video$1 />');
fs.writeFileSync('src/components/AsciiBackground.jsx', code);
