const fs = require('fs');
const path = require('path');

const filesToUpdate = [
  'src/components/sections/BestSellers.jsx',
  'src/components/sections/FeaturedAccounts.jsx',
  'src/components/sections/NewArrivals.jsx',
  'src/components/sections/PopularProducts.jsx',
  'src/components/sections/RecommendedProducts.jsx',
];

filesToUpdate.forEach(relativePath => {
  const filePath = path.join(__dirname, '..', relativePath);
  if (!fs.existsSync(filePath)) return;

  let content = fs.readFileSync(filePath, 'utf8');

  // Replace `background: item.accentColor, color: '#000'` with `background: item.accentColor || 'var(--accent)', color: '#000'`
  // Make sure not to double replace
  if (content.includes("background: item.accentColor, color: '#000'")) {
    content = content.replace(/background: item\.accentColor, color: '#000'/g, "background: item.accentColor || 'var(--accent)', color: '#000'");
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Fixed button background in ${relativePath}`);
  }
});
