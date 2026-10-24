// Quick script to check if a SKU exists in the database
const { db } = require('./apps/server/dist/db/index.js');
const { products } = require('./apps/server/dist/db/schema/products.js');
const { eq } = require('drizzle-orm');

async function checkSKU(sku) {
  try {
    const result = await db
      .select()
      .from(products)
      .where(eq(products.sku, sku));
    
    if (result.length > 0) {
      console.log(`✗ SKU "${sku}" already exists:`);
      console.log(JSON.stringify(result[0], null, 2));
    } else {
      console.log(`✓ SKU "${sku}" is available`);
    }
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

const sku = process.argv[2] || '100';
checkSKU(sku);
