// Script to update homepage section cards to navigate to /product/:id instead of calling onInquire
const fs = require('fs');
const path = require('path');

const filesToUpdate = [
  'src/components/sections/BestSellers.jsx',
  'src/components/sections/FeaturedAccounts.jsx',
  'src/components/sections/NewArrivals.jsx',
  'src/components/sections/PopularProducts.jsx',
  'src/components/sections/RecommendedProducts.jsx',
  'src/components/sections/TrendingAccounts.jsx',
  'src/pages/GamingCartsPage.jsx',
];

filesToUpdate.forEach(relativePath => {
  const filePath = path.join(__dirname, '..', relativePath);
  if (!fs.existsSync(filePath)) {
    console.log('SKIP (not found):', relativePath);
    return;
  }
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  // 1. Add useNavigate import if not present
  if (!content.includes('useNavigate') && content.includes("from 'react-router-dom'")) {
    content = content.replace(
      /import \{([^}]+)\} from 'react-router-dom'/,
      (match, imports) => {
        if (!imports.includes('useNavigate')) {
          return `import {${imports.trim()}, useNavigate } from 'react-router-dom'`;
        }
        return match;
      }
    );
    changed = true;
  } else if (!content.includes('useNavigate') && !content.includes("from 'react-router-dom'")) {
    // No react-router-dom import yet — add it at top
    content = "import { useNavigate } from 'react-router-dom';\n" + content;
    changed = true;
  }

  // 2. Add useNavigate() call inside the Card component function if it has hovered state
  // Targets: function BestSellerCard / function TrendingCard / function ProductCatalogCard etc.
  // Pattern: const [hovered, setHovered] = useState(false);
  // Add: const navigate = useNavigate(); after it
  if (!content.includes('const navigate = useNavigate()')) {
    // Add navigate after the first hovered useState in a Card sub-component
    content = content.replace(
      /(const \[hovered, setHovered\] = useState\(false\);)/,
      '$1\n  const navigate = useNavigate();'
    );
    changed = true;
  }

  // 3. Update card div onClick to navigate to /product/:id
  // Old pattern: onClick={() => { playClickSound(); }}
  // Or: onClick={(e) => { e.stopPropagation(); onInquire(item); }}
  // We want: card itself navigates to /product/:id
  // Target the outer card's onClick on the motion.div that has onMouseEnter/onMouseLeave for hovered
  if (content.includes("onInquire(item)") && !content.includes("navigate(`/product/${item.id}`)")) {
    // Replace ORDER NOW button click
    content = content.replace(
      /onClick=\{\(e\) => \{\s*e\.stopPropagation\(\);\s*playSuccessSound\(\);\s*onInquire\(item\);\s*\}\}/g,
      "onClick={(e) => { e.stopPropagation(); navigate(`/product/${item.id}`); }}"
    );
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Updated:', relativePath);
  } else {
    console.log('No changes needed:', relativePath);
  }
});
