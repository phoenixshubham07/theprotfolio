const fs = require('fs');
const file = '/Users/phoenixechoes/Documents/portfolio/src/components/Contact.jsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/const \[flirtyMessage, setFlirtyMessage\][^]*?\}\n  \}/m, '');
content = content.replace(/\{\/\* Quirky Role Selector \*\/}[^]*?<div className=\{styles\.details\}>/m, '<div className={styles.details}>');

fs.writeFileSync(file, content);
console.log("Updated");
