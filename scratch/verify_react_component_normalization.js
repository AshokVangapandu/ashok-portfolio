// scratch/verify_react_component_normalization.js
import assert from 'assert';

function normalizeHareNiemeyer(sortedItems, effectiveTotal) {
  if (sortedItems.length === 0 || effectiveTotal === 0) {
    return sortedItems.map((item) => ({ ...item, percentage: 0 }));
  }

  const raw = sortedItems.map((item, index) => {
    const visits = Number(item.count ?? item.visits ?? 0);
    const rawPct = (visits / effectiveTotal) * 100;
    const floor = Math.floor(rawPct);
    const rem = rawPct - floor;
    return { index, visits, rawPct, floor, rem };
  });

  const sumFloor = raw.reduce((sum, r) => sum + r.floor, 0);
  const diff = Math.max(0, 100 - sumFloor);

  // Sort by remainder descending, then by visits descending
  const sortedByRem = [...raw].sort((a, b) => {
    if (b.rem !== a.rem) return b.rem - a.rem;
    return b.visits - a.visits;
  });

  const finalPcts = new Array(sortedItems.length).fill(0);
  sortedByRem.forEach((r, rank) => {
    finalPcts[r.index] = r.floor + (rank < diff ? 1 : 0);
  });

  return sortedItems.map((item, idx) => ({
    ...item,
    percentage: finalPcts[idx],
  }));
}

// Test Scenarios
console.log('====================================================');
console.log(' RUNNING SCENARIOS A, B, C, D, E VERIFICATION');
console.log('====================================================');

// Scenario A
const scenA_items = [
  { name: 'Firefox', count: 4, rank: 1 },
  { name: 'Chrome', count: 3, rank: 2 },
  { name: 'Edge', count: 1, rank: 3 }
];
const scenA_total = 8;
const scenA_res = normalizeHareNiemeyer(scenA_items, scenA_total);
const scenA_sum = scenA_res.reduce((s, x) => s + x.percentage, 0);
console.log('\nScenario A (8 sessions: Firefox 4, Chrome 3, Edge 1):');
console.table(scenA_res);
console.log(`Total Percentage: ${scenA_sum}%`);
assert.strictEqual(scenA_sum, 100);
assert.strictEqual(scenA_res[0].percentage, 50);
assert.strictEqual(scenA_res[1].percentage, 38);
assert.strictEqual(scenA_res[2].percentage, 12);

// Scenario B
const scenB_items = [
  { name: 'Chrome', count: 38, rank: 1 },
  { name: 'Firefox', count: 4, rank: 2 },
  { name: 'Edge', count: 1, rank: 3 }
];
const scenB_total = 43;
const scenB_res = normalizeHareNiemeyer(scenB_items, scenB_total);
const scenB_sum = scenB_res.reduce((s, x) => s + x.percentage, 0);
console.log('\nScenario B (43 sessions: Chrome 38, Firefox 4, Edge 1):');
console.table(scenB_res);
console.log(`Total Percentage: ${scenB_sum}%`);
assert.strictEqual(scenB_sum, 100);
assert.strictEqual(scenB_res[0].percentage, 89);
assert.strictEqual(scenB_res[1].percentage, 9);
assert.strictEqual(scenB_res[2].percentage, 2);

// Scenario C
const scenC_items = [
  { name: 'Windows', count: 72, rank: 1 },
  { name: 'Android', count: 20, rank: 2 },
  { name: 'macOS', count: 20, rank: 3 },
  { name: 'Others', count: 15, rank: undefined }
];
const scenC_total = 127;
const scenC_res = normalizeHareNiemeyer(scenC_items, scenC_total);
const scenC_sum = scenC_res.reduce((s, x) => s + x.percentage, 0);
console.log('\nScenario C (127 sessions: Windows 72, Android 20, macOS 20, Others 15):');
console.table(scenC_res);
console.log(`Total Percentage: ${scenC_sum}%`);
assert.strictEqual(scenC_sum, 100);
assert.strictEqual(scenC_res[0].percentage, 56);
assert.strictEqual(scenC_res[1].percentage, 16);
assert.strictEqual(scenC_res[2].percentage, 16);
assert.strictEqual(scenC_res[3].percentage, 12);
assert.strictEqual(scenC_res[3].name, 'Others'); // Others remains final category

// Scenario D
const scenD_items = [
  { name: 'Windows', count: 99, rank: 1 },
  { name: 'Android', count: 33, rank: 2 },
  { name: 'macOS', count: 21, rank: 3 },
  { name: 'Others', count: 19, rank: undefined }
];
const scenD_total = 172;
const scenD_res = normalizeHareNiemeyer(scenD_items, scenD_total);
const scenD_sum = scenD_res.reduce((s, x) => s + x.percentage, 0);
console.log('\nScenario D (172 sessions: Windows 99, Android 33, macOS 21, Others 19):');
console.table(scenD_res);
console.log(`Total Percentage: ${scenD_sum}%`);
assert.strictEqual(scenD_sum, 100);
assert.strictEqual(scenD_res[0].percentage, 58);
assert.strictEqual(scenD_res[1].percentage, 19);
assert.strictEqual(scenD_res[2].percentage, 12);
assert.strictEqual(scenD_res[3].percentage, 11);
assert.strictEqual(scenD_res[3].name, 'Others'); // Others remains final category

// Scenario E
const scenE_items = [];
const scenE_total = 0;
const scenE_res = normalizeHareNiemeyer(scenE_items, scenE_total);
console.log('\nScenario E (0 sessions: Empty State):');
console.log('Result length:', scenE_res.length);
assert.strictEqual(scenE_res.length, 0);

console.log('\n✓ ALL SCENARIOS A, B, C, D, E PASSED WITH 100% SUM ASSERTIONS!\n');
