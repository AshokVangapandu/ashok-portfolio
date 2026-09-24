// scratch/test_normalization_scenarios.js

function normalizePercentagesHareNiemeyer(items) {
  const totalVisits = items.reduce((sum, item) => sum + (item.visits || 0), 0);
  if (totalVisits === 0) {
    return items.map(item => ({ ...item, percentage: 0 }));
  }

  const raw = items.map((item, index) => {
    const rawPct = (item.visits / totalVisits) * 100;
    const floor = Math.floor(rawPct);
    const rem = rawPct - floor;
    return { index, visits: item.visits, rawPct, floor, rem };
  });

  const sumFloor = raw.reduce((sum, r) => sum + r.floor, 0);
  let diff = 100 - sumFloor;

  // Sort by remainder descending, then by visits descending
  const sorted = [...raw].sort((a, b) => {
    if (b.rem !== a.rem) return b.rem - a.rem;
    return b.visits - a.visits;
  });

  const finalPercentages = new Array(items.length).fill(0);
  sorted.forEach((r, rank) => {
    finalPercentages[r.index] = r.floor + (rank < diff ? 1 : 0);
  });

  return items.map((item, idx) => ({
    ...item,
    percentage: finalPercentages[idx]
  }));
}

// CountryDistribution / Max Residual adjustment
function normalizePercentagesCountryDistStyle(items) {
  const totalVisits = items.reduce((sum, item) => sum + (item.visits || 0), 0);
  if (totalVisits === 0) {
    return items.map(item => ({ ...item, percentage: 0 }));
  }

  const rawPcts = items.map(item => (item.visits / totalVisits) * 100);
  const rounded = rawPcts.map(r => Math.round(r));
  const currentSum = rounded.reduce((a, b) => a + b, 0);
  const diff = 100 - currentSum;

  if (diff !== 0) {
    let maxIdx = 0;
    let maxVal = -1;
    items.forEach((item, idx) => {
      if (item.visits > 0 && rawPcts[idx] > maxVal) {
        maxVal = rawPcts[idx];
        maxIdx = idx;
      }
    });
    rounded[maxIdx] += diff;
  }

  return items.map((item, idx) => ({
    ...item,
    percentage: rounded[idx]
  }));
}

const testCases = [
  {
    name: 'Scenario A (8 sessions: Firefox 4, Chrome 3, Edge 1)',
    data: [{ name: 'Firefox', visits: 4 }, { name: 'Chrome', visits: 3 }, { name: 'Edge', visits: 1 }]
  },
  {
    name: 'Scenario B (43 sessions: Chrome 38, Firefox 4, Edge 1)',
    data: [{ name: 'Chrome', visits: 38 }, { name: 'Firefox', visits: 4 }, { name: 'Edge', visits: 1 }]
  },
  {
    name: 'Scenario C (127 sessions: Windows 72, Android 20, macOS 20, Others 15)',
    data: [{ name: 'Windows', visits: 72 }, { name: 'Android', visits: 20 }, { name: 'macOS', visits: 20 }, { name: 'Others', visits: 15 }]
  },
  {
    name: 'Scenario D (172 sessions: Windows 99, Android 33, macOS 21, Others 19)',
    data: [{ name: 'Windows', visits: 99 }, { name: 'Android', visits: 33 }, { name: 'macOS', visits: 21 }, { name: 'Others', visits: 19 }]
  },
  {
    name: 'Scenario E (0 sessions: Empty State)',
    data: []
  }
];

console.log('=== HARE-NIEMEYER RESULTS ===');
testCases.forEach(tc => {
  console.log(`\n${tc.name}:`);
  const res = normalizePercentagesHareNiemeyer(tc.data);
  console.log(res);
  const sum = res.reduce((s, r) => s + r.percentage, 0);
  console.log(`Total Percentage Sum: ${sum}%`);
});

console.log('\n=== COUNTRY-DIST STYLE RESULTS ===');
testCases.forEach(tc => {
  console.log(`\n${tc.name}:`);
  const res = normalizePercentagesCountryDistStyle(tc.data);
  console.log(res);
  const sum = res.reduce((s, r) => s + r.percentage, 0);
  console.log(`Total Percentage Sum: ${sum}%`);
});
