const fs = require('fs');
const path = require('path');

const filesToUpdate = [
  'src/components/sections/BestSellers.jsx',
  'src/components/sections/FeaturedAccounts.jsx',
  'src/components/sections/NewArrivals.jsx',
  'src/components/sections/PopularProducts.jsx',
  'src/components/sections/RecommendedProducts.jsx',
  'src/pages/GamingCartsPage.jsx'
];

filesToUpdate.forEach(relativePath => {
  const filePath = path.join(__dirname, '..', relativePath);
  if (!fs.existsSync(filePath)) return;

  let content = fs.readFileSync(filePath, 'utf8');

  // Replace the Quality Inspected span with the Price span
  // Need to be careful because GamingCartsPage has a different gap/size.
  // We'll replace the block:
  // <span className="font-body" style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: '#ffffff' }}>
  //   <ShieldCheck size={12} style={{ color: item.accentColor }} /> Quality Inspected
  // </span>
  
  const searchPattern = /<span className="font-body" style=\{\{\s*display:\s*'flex'[^>]*>\s*<ShieldCheck[^>]*>\s*Quality Inspected\s*<\/span>/gs;
  
  const replacement = `<span className="font-display" style={{ fontSize: '1.6rem', color: hovered ? 'var(--accent)' : '#fff', transition: 'color 0.3s' }}>\n                \${item.price}\n              </span>`;

  if (searchPattern.test(content)) {
    content = content.replace(searchPattern, replacement);
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${relativePath}`);
  } else {
    console.log(`Pattern not found in ${relativePath}`);
  }
});
