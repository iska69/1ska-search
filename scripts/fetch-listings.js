// scripts/fetch-listings.js
import fetch from 'node-fetch';
import { writeFileSync } from 'fs';

async function main() {
  const API_KEY = process.env.CS_FLOAT_API_KEY;
  if (!API_KEY) throw new Error('Missing CS_FLOAT_API_KEY');
  const res = await fetch('https://csfloat.com/api/v1/listings', {
    headers: { Authorization: API_KEY }
  });
  const json = await res.json();
  if (!Array.isArray(json.data)) throw new Error('Unexpected API response');
  writeFileSync('docs/listings.json', JSON.stringify(json.data, null, 2));
  console.log(`Wrote ${json.data.length} listings`);
}

main().catch(err => { console.error(err); process.exit(1); });
