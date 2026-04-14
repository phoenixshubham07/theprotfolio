const fs = require('fs');
let code = fs.readFileSync('src/components/AsciiBackground.jsx', 'utf8');

// Fix unclosed video tag (JSX parse error)
code = code.replace(/<video([^>]*?)(?<!\/)>\s*<\/div>/g, '<video$1 />\n    </div>');

fs.writeFileSync('src/components/AsciiBackground.jsx', code);
