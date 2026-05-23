// Test the category route directly to reproduce the 500 error
import app from './api/index.js';
import http from 'http';

const PORT = 5001; // different from default to avoid conflict
const server = http.createServer(app);

server.listen(PORT, async () => {
  console.log(`Test server on port ${PORT}`);

  try {
    const { default: fetch } = await import('node-fetch');
    
    // Test 1: Get all categories
    console.log('\n--- Test 1: GET /api/categories ---');
    const r1 = await fetch(`http://localhost:${PORT}/api/categories`);
    console.log('Status:', r1.status);
    
    // Test 2: Get game-systems category by slug
    console.log('\n--- Test 2: GET /api/categories/game-systems ---');
    const r2 = await fetch(`http://localhost:${PORT}/api/categories/game-systems`);
    console.log('Status:', r2.status);
    const body2 = await r2.json();
    console.log('Body:', body2);

    // Test 3: Get arcade-games (subcategory)
    console.log('\n--- Test 3: GET /api/categories/arcade-games ---');
    const r3 = await fetch(`http://localhost:${PORT}/api/categories/arcade-games`);
    console.log('Status:', r3.status);
    const body3 = await r3.json();
    console.log('Body:', body3);
    
  } catch(e) {
    console.error('Fetch error:', e.message);
  } finally {
    server.close();
    process.exit(0);
  }
});
