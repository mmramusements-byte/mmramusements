const fs = require('fs');
const path = require('path');

const filesToUpdate = [
  'src/components/sections/BestSellers.jsx',
  'src/components/sections/FeaturedAccounts.jsx',
  'src/components/sections/NewArrivals.jsx',
  'src/components/sections/PopularProducts.jsx',
  'src/components/sections/RecommendedProducts.jsx',
  'src/components/sections/AccountDeals.jsx',
  'src/pages/GamingCartsPage.jsx'
];

filesToUpdate.forEach(relativePath => {
  const filePath = path.join(__dirname, '..', relativePath);
  if (!fs.existsSync(filePath)) return;

  let content = fs.readFileSync(filePath, 'utf8');

  // Change background gradient if it exists
  content = content.replace(
    /background: 'linear-gradient\(to top, rgba\(0,0,0,0\.95\) 0%, rgba\(0,0,0,0\.6\) 40%, rgba\(0,0,0,0\.2\) 100%\)'/g,
    "background: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.7) 40%, rgba(0,0,0,0.3) 100%)', transition: 'opacity 0.3s', opacity: hovered ? 1 : 0.7"
  );
  
  // We want to pull the bottom <div> out of the <motion.div> and move it below.
  // Using a regex to find the closing </motion.div> and the <div> right above it.
  
  // For most cards, it's something like:
  // <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
  //   <span ...>
  //     <ShieldCheck size={12} ... /> Quality Inspected
  //   </span>
  //   <motion.button ...> ... ORDER NOW ... </motion.button>
  // </div>
  // </motion.div>
  
  // Let's replace the `</motion.div>` if the button is just above it.
  // This is tricky with regex. I will do string manipulation based on common patterns.
  
  const searchPattern = `<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>`;
  
  if (content.includes(searchPattern)) {
    // Find all occurrences
    let parts = content.split(searchPattern);
    
    // For each part starting from index 1:
    for (let i = 1; i < parts.length; i++) {
      let part = parts[i];
      // Find the end of the motion.div
      let endIndex = part.indexOf('</motion.div>');
      if (endIndex !== -1) {
        // Look inside the part before </motion.div> to see if there is an ORDER NOW button
        let innerPart = part.substring(0, endIndex);
        if (innerPart.includes('ORDER NOW')) {
           // We found the block! We need to move </motion.div> to BEFORE the <div style...
           // So the replacement string should be `</motion.div>\n<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '16px' }}>`
           // And remove the </motion.div> from after.
           
           // We also need to inject opacity into the motion.button's style.
           // `style={{ cursor: 'pointer', ...` => `style={{ opacity: hovered ? 1 : 0, cursor: 'pointer', ...`
           
           innerPart = innerPart.replace(/style=\{\{\s*cursor/g, "style={{ opacity: hovered ? 1 : 0, transition: 'opacity 0.3s', cursor");
           
           parts[i] = innerPart + part.substring(endIndex + '</motion.div>'.length);
           parts[i - 1] = parts[i - 1] + '</motion.div>\n';
           
           // The replacement for searchPattern will use a marginTop
           parts[i] = parts[i]; 
        }
      }
    }
    
    content = parts.join(`<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '16px' }}>`);
  }

  // GamingCartsPage has a different structure:
  // <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
  //   <span className="font-body" style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: '#fff', fontWeight: 500 }}>
  if (relativePath.includes('GamingCartsPage')) {
     content = content.replace(
        /background: 'linear-gradient\(to top, rgba\(0,0,0,0\.95\) 0%, rgba\(0,0,0,0\.6\) 40%, rgba\(0,0,0,0\.2\) 100%\)', transition: 'opacity 0\.3s', opacity: hovered \? 1 : 0\.8/g,
        "background: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.7) 40%, rgba(0,0,0,0.3) 100%)', transition: 'opacity 0.3s', opacity: hovered ? 1 : 0.7"
     );
  }

  // AccountDeals has a different CTA:
  // It uses <motion.button ... > <MessageSquare /> Inquire Bundle
  // Wait, I already updated AccountDeals to "ORDER NOW <ShoppingCart size={14} />" in the previous script!
  // Let's check if it has the `display: 'flex', alignItems: 'center', justifyContent: 'space-between'` div. No, it doesn't.
  // In AccountDeals:
  // {/* CTA */}
  // <motion.button ...> ORDER NOW ...
  if (relativePath.includes('AccountDeals')) {
     const buttonPattern = `{/* CTA */}\n        <motion.button`;
     if (content.includes(buttonPattern)) {
        let parts = content.split(`{/* CTA */}`);
        for(let i=1; i<parts.length; i++) {
           let part = parts[i];
           let endIndex = part.indexOf('</motion.button>');
           if (endIndex !== -1 && part.includes('ORDER NOW')) {
              let inner = part.substring(0, endIndex + '</motion.button>'.length);
              // extract this from inside the motion.div!
              // In AccountDeals, the <motion.div animate={{ height: ... }}> ends around line 153.
              // Wait, in AccountDeals, the button is already OUTSIDE the description!
              // Let's verify this, I might not need to change AccountDeals layout.
              // Just add the opacity.
              inner = inner.replace(/style=\{\{\s*cursor/g, "style={{ opacity: hovered ? 1 : 0, transition: 'opacity 0.3s', cursor");
              parts[i] = inner + part.substring(endIndex + '</motion.button>'.length);
           }
        }
        content = parts.join(`{/* CTA */}`);
     }
  }

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Updated ${relativePath}`);
});
