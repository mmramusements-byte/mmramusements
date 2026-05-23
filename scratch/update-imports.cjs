const fs = require('fs');
const path = require('path');

const sectionsDir = path.join(__dirname, '../src/components/sections');
const files = [
  'AccountDeals.jsx',
  'BestSellers.jsx',
  'FeaturedAccounts.jsx',
  'NewArrivals.jsx',
  'PopularProducts.jsx',
  'RecommendedProducts.jsx',
  'TrendingAccounts.jsx'
];

files.forEach(file => {
  const filePath = path.join(sectionsDir, file);
  if (!fs.existsSync(filePath)) return;
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Ensure ShoppingCart is imported!
  if (content.includes('<ShoppingCart') && !content.includes('ShoppingCart,')) {
    content = content.replace(/import \{ (.*) \} from 'lucide-react';/, (match, p1) => {
      if (!p1.includes('ShoppingCart')) {
        return `import { ${p1}, ShoppingCart } from 'lucide-react';`;
      }
      return match;
    });
  }

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Updated imports in ${file}`);
});
