const fs = require('fs');
const path = require('path');

const sectionsDir = path.join(__dirname, '../src/components/sections');
const files = fs.readdirSync(sectionsDir).filter(f => f.endsWith('.jsx'));

files.forEach(file => {
  const filePath = path.join(sectionsDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  let changed = false;

  const patternsToReplace = [
    /<MessageSquare size=\{13\} \/> Inquire Bundle/g,
    /<MessageSquare size=\{12\} \/> ORDER NOW/g,
    /Order Cabinet <ArrowRight size=\{12\} \/>/g,
    /Order Board <ArrowRight size=\{12\} \/>/g,
    /View Details <ArrowRight size=\{12\} \/>/g,
    /B2B Inquiry <ArrowRight size=\{12\} \/>/g,
    /Inquire Bundle/g
  ];

  patternsToReplace.forEach(regex => {
    if (regex.test(content)) {
      content = content.replace(regex, 'ORDER NOW <ShoppingCart size={14} />');
      changed = true;
    }
  });

  if (changed) {
    if (content.includes('<ShoppingCart') && !content.includes('ShoppingCart,')) {
      content = content.replace(/import \{ (.*) \} from 'lucide-react';/, (match, p1) => {
        if (!p1.includes('ShoppingCart')) {
          return `import { ${p1}, ShoppingCart } from 'lucide-react';`;
        }
        return match;
      });
    }
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated content in ${file}`);
  }
});
