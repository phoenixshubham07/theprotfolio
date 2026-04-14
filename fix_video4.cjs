const fs = require('fs');
let code = fs.readFileSync('src/components/AsciiBackground.jsx', 'utf8');

// Close the unclosed video tag properly
// When the previous command replaced the `loop` it stripped the `/>` by accident
code = code.replace(/<video(.*?)loop(.*?)>/i, '<video$1$2>');
code = code.replace(/<video([^>]*?)(?<!\/)>/g, '<video$1 />');

fs.writeFileSync('src/components/AsciiBackground.jsx', code);
