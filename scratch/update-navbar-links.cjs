const fs = require('fs');
const path = require('path');

const navbarPath = path.join(__dirname, '../src/components/layout/Navbar.jsx');
let content = fs.readFileSync(navbarPath, 'utf8');

const newMegaMenuData = `const megaMenuData = {
  columns: [
    {
      heading: 'Game Boards',
      links: [
        { label: 'All Game Boards', to: '/categories/game-boards' },
        { label: 'Amigo Boards', to: '/categories/game-boards/amigo-game-boards' },
        { label: 'Amcoe Boards', to: '/categories/game-boards/amcoe-game-boards' },
        { label: 'Astro Boards', to: '/categories/game-boards/astro-game-boards' },
        { label: 'Banilla Boards', to: '/categories/game-boards/banilla-game-boards' },
        { label: 'Big Daddy Boards', to: '/categories/game-boards/big-daddy-game-boards' },
        { label: 'Black Clover', to: '/categories/game-boards/black-clover-game-boards' },
        { label: 'Borden Boards', to: '/categories/game-boards/borden-game-boards' },
        { label: 'Dyna Boards', to: '/categories/game-boards/dyna-game-boards' },
        { label: 'IGS Boards', to: '/categories/game-boards/igs-game-boards' },
        { label: 'Jenka Lab', to: '/categories/game-boards/jenka-lab-game-boards' },
        { label: 'Master Panda', to: '/categories/game-boards/master-panda-game-boards' },
        { label: 'Ocean King', to: '/categories/game-boards/ocean-king-game-boards' },
        { label: 'Primero Boards', to: '/categories/game-boards/primero-game-boards' },
        { label: 'Subsino Boards', to: '/categories/game-boards/subsino-game-boards' },
        { label: 'Trestle Boards', to: '/categories/game-boards/trestle-game-boards' },
        { label: 'Zydexo Boards', to: '/categories/game-boards/zydexo-game-boards' },
      ],
    },
    {
      heading: 'Gaming Systems',
      links: [
        { label: 'All Gaming Systems', to: '/categories/game-systems' },
        { label: 'Arcade Games', to: '/categories/game-systems/arcade-games' },
        { label: 'Fish Games', to: '/categories/game-systems/fish-games' },
        { label: 'Coin Pushers', to: '/categories/game-systems/coin-quarter-pushers' },
        { label: 'Skill Games', to: '/categories/game-systems/nudge-skill-games' },
        { label: 'Preview / No Chance', to: '/categories/game-systems/preview-no-chance-games' },
        { label: 'Multi-Game Systems', to: '/categories/game-systems/multi-game-systems' },
        { label: 'Progressive Linking', to: '/categories/game-systems/progressive-linking-systems' },
        { label: 'Redemption Kiosks', to: '/categories/game-systems/redemption-kiosk' },
      ],
    },
    {
      heading: 'Cabinets & Hardware',
      links: [
        { label: 'All Cabinets', to: '/categories/cabinets-hardware' },
        { label: 'Board Ready Cabinets', to: '/categories/cabinets-hardware/board-ready-cabinets' },
        { label: 'Mobile Game Kiosks', to: '/categories/cabinets-hardware/mobile-game-kiosk' },
        { label: 'Upright Cabinets', to: '/categories/cabinets-hardware/upright-cabinets' },
        { label: 'Countertop Terminals', to: '/categories/cabinets-hardware/countertop-cabinets' },
        { label: 'Touchscreen Cabinets', to: '/categories/cabinets-hardware/touchscreen-cabinets' },
        { label: 'Gaming Stools', to: '/categories/cabinets-hardware/gaming-stools' },
      ],
    },
    {
      heading: 'Parts & Supplies',
      links: [
        { label: 'All Parts & Supplies', to: '/categories/parts-supplies' },
        { label: 'Bill Acceptors', to: '/categories/parts-supplies/bill-acceptors-accessories' },
        { label: 'LCD Monitors', to: '/categories/parts-supplies/lcd-monitors' },
        { label: 'Power Supplies', to: '/categories/parts-supplies/power-supplies' },
        { label: 'Harnesses & Cables', to: '/categories/parts-supplies/harnesses' },
        { label: 'Pushbuttons', to: '/categories/parts-supplies/pushbuttons' },
        { label: 'Card Readers', to: '/categories/parts-supplies/card-reader-solutions' },
        { label: 'Cabinet Parts', to: '/categories/parts-supplies/cabinet-parts-supplies' },
      ],
    },
  ],
  quickLinks: [
    { label: 'Weekly Deals', to: '/deals', accent: true },
    { label: 'Full Catalog', to: '/gaming-carts' },
    { label: 'Popular Products', to: '/popular' },
  ],
};`;

const regex = /const megaMenuData = \{[\s\S]*?quickLinks: \[\s*\{ label: 'Weekly Deals', to: '\/deals', accent: true \},\s*\{ label: 'Gaming Carts', to: '\/gaming-carts' \},\s*\{ label: 'Popular Accounts', to: '\/popular' \},\s*\],\s*\};/m;

content = content.replace(regex, newMegaMenuData);

// Wait, I need to check if the regex matched, or I can just use a more robust regex since I know it ends with quickLinks array.
const betterRegex = /const megaMenuData = \{[\s\S]*?quickLinks: \[[\s\S]*?\],\s*\};/;
content = content.replace(betterRegex, newMegaMenuData);

fs.writeFileSync(navbarPath, content, 'utf8');
console.log('Navbar updated');
