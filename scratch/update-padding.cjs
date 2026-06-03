const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '..', 'src', 'pages');
const files = fs.readdirSync(dir);

files.forEach(file => {
  if (file.endsWith('.jsx')) {
    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Replace padding top inline styles
    // Ex: paddingTop: '120px'
    if (content.includes("paddingTop: '120px'")) {
      content = content.replace(/paddingTop: '120px'/g, "paddingTop: '160px'");
      fs.writeFileSync(filePath, content, 'utf8');
      console.log('Updated', file);
    }
  }
});
