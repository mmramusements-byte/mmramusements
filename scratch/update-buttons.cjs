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
  
  // Need to replace the contents inside the <motion.button> ... </motion.button>
  // Let's replace the whole inner text of the button.
  // The structure is usually:
  // <motion.button ...>
  //   Order Cabinet <ArrowRight size={12} />
  // </motion.button>
  
  // Or: B2B Inquiry <ArrowRight...
  
  content = content.replace(/Order Cabinet <ArrowRight size=\{12\} \/>/g, 'ORDER NOW <ShoppingCart size={14} />');
  content = content.replace(/Order Board <ArrowRight size=\{12\} \/>/g, 'ORDER NOW <ShoppingCart size={14} />');
  content = content.replace(/View Details <ArrowRight size=\{12\} \/>/g, 'ORDER NOW <ShoppingCart size={14} />');
  content = content.replace(/B2B Inquiry <ArrowRight size=\{12\} \/>/g, 'ORDER NOW <ShoppingCart size={14} />');
  content = content.replace(/ORDER NOW <ArrowRight size=\{12\} \/>/g, 'ORDER NOW <ShoppingCart size={14} />');

  // For TrendingAccounts.jsx (which has a different structure):
  // <MessageSquare size={12} /> ORDER NOW
  content = content.replace(/<MessageSquare size=\{12\} \/> B2B Inquiry/g, 'ORDER NOW <ShoppingCart size={14} />');
  content = content.replace(/<MessageSquare size=\{12\} \/> ORDER NOW/g, 'ORDER NOW <ShoppingCart size={14} />');

  // Ensure ShoppingCart is imported!
  if (content.includes('ORDER NOW <ShoppingCart size={14} />') && !content.includes('ShoppingCart')) {
    content = content.replace(/import \{ (.*) \} from 'lucide-react';/, (match, p1) => {
      if (!p1.includes('ShoppingCart')) {
        return `import { ${p1}, ShoppingCart } from 'lucide-react';`;
      }
      return match;
    });
  }

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Updated ${file}`);
});
