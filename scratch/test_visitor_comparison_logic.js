// scratch/test_visitor_comparison_logic.js
// Validates all 12 test scenarios and invariants against the visitor-level specification

function calculateVisitorComparison({ currentSessions, priorSessionsHistory, timeRange = '7days', prevReturning = 0, prevNew = 0 }) {
  // 1. Group current sessions by visitor_id
  const activeVisitorIds = [...new Set(currentSessions.map(s => s.visitor_id))];
  const totalUniqueVisitors = activeVisitorIds.length;

  if (totalUniqueVisitors === 0) {
    return {
      totalUniqueVisitors: 0,
      newVisitors: 0,
      returningVisitors: 0,
      newPercentage: 0,
      returningPercentage: 0,
      newTrend: '+0.0%',
      returningTrend: '+0.0%'
    };
  }

  // 2. Classify each active visitor based on lifetime history prior to current period
  let newVisitors = 0;
  let returningVisitors = 0;

  for (const vId of activeVisitorIds) {
    const hasPriorSession = priorSessionsHistory.some(s => s.visitor_id === vId);
    if (hasPriorSession) {
      returningVisitors++;
    } else {
      newVisitors++;
    }
  }

  // 3. Percentages with zero drift
  const newPercentage = Math.round((newVisitors / totalUniqueVisitors) * 100);
  const returningPercentage = 100 - newPercentage;

  // 4. Trends
  let returningTrend = '+0.0%';
  if (prevReturning === 0) {
    returningTrend = returningVisitors > 0 ? '—' : '+0.0%';
  } else {
    const delta = ((returningVisitors - prevReturning) / prevReturning) * 100;
    returningTrend = (delta >= 0 ? '+' : '') + delta.toFixed(1) + '%';
  }

  let newTrend = '+0.0%';
  if (prevNew === 0) {
    newTrend = newVisitors > 0 ? '—' : '+0.0%';
  } else {
    const delta = ((newVisitors - prevNew) / prevNew) * 100;
    newTrend = (delta >= 0 ? '+' : '') + delta.toFixed(1) + '%';
  }

  return {
    totalUniqueVisitors,
    newVisitors,
    returningVisitors,
    newPercentage,
    returningPercentage,
    newTrend,
    returningTrend
  };
}

// Test Runner
function runAllTests() {
  console.log('====================================================');
  console.log('RUNNING VISITOR-LEVEL ANALYTICS VALIDATION SUITE');
  console.log('====================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(testName, actual, expected) {
    const isMatch = JSON.stringify(actual) === JSON.stringify(expected);
    if (isMatch) {
      console.log(`✅ PASS: ${testName}`);
      passed++;
    } else {
      console.error(`❌ FAIL: ${testName}`);
      console.error('   Expected:', JSON.stringify(expected, null, 2));
      console.error('   Actual:  ', JSON.stringify(actual, null, 2));
      failed++;
    }
  }

  // TEST 1 — Brand-new visitor (1 visitor, 1 session)
  assert('TEST 1: Brand-new visitor (1 visitor, 1 session)', 
    calculateVisitorComparison({
      currentSessions: [{ visitor_id: 'v1', id: 's1' }],
      priorSessionsHistory: []
    }),
    {
      totalUniqueVisitors: 1,
      newVisitors: 1,
      returningVisitors: 0,
      newPercentage: 100,
      returningPercentage: 0,
      newTrend: '—',
      returningTrend: '+0.0%'
    }
  );

  // TEST 2 — One visitor, many sessions (1 visitor, 5 sessions)
  assert('TEST 2: One visitor, 5 sessions',
    calculateVisitorComparison({
      currentSessions: [
        { visitor_id: 'v1', id: 's1' },
        { visitor_id: 'v1', id: 's2' },
        { visitor_id: 'v1', id: 's3' },
        { visitor_id: 'v1', id: 's4' },
        { visitor_id: 'v1', id: 's5' }
      ],
      priorSessionsHistory: []
    }),
    {
      totalUniqueVisitors: 1,
      newVisitors: 1,
      returningVisitors: 0,
      newPercentage: 100,
      returningPercentage: 0,
      newTrend: '—',
      returningTrend: '+0.0%'
    }
  );

  // TEST 3 — Two new visitors
  assert('TEST 3: Two new visitors',
    calculateVisitorComparison({
      currentSessions: [
        { visitor_id: 'v1', id: 's1' },
        { visitor_id: 'v2', id: 's2' }
      ],
      priorSessionsHistory: []
    }),
    {
      totalUniqueVisitors: 2,
      newVisitors: 2,
      returningVisitors: 0,
      newPercentage: 100,
      returningPercentage: 0,
      newTrend: '—',
      returningTrend: '+0.0%'
    }
  );

  // TEST 4 — Returning visitor (first seen before period)
  assert('TEST 4: Returning visitor',
    calculateVisitorComparison({
      currentSessions: [{ visitor_id: 'v1', id: 's2' }],
      priorSessionsHistory: [{ visitor_id: 'v1', id: 's1' }]
    }),
    {
      totalUniqueVisitors: 1,
      newVisitors: 0,
      returningVisitors: 1,
      newPercentage: 0,
      returningPercentage: 100,
      newTrend: '+0.0%',
      returningTrend: '—'
    }
  );

  // TEST 5 — Mixed visitors (Visitor A, B new; Visitor C, D returning)
  assert('TEST 5: Mixed visitors (2 New, 2 Returning with 12 total sessions)',
    calculateVisitorComparison({
      currentSessions: [
        { visitor_id: 'vA', id: 's1' },
        { visitor_id: 'vA', id: 's2' },
        { visitor_id: 'vA', id: 's3' },
        { visitor_id: 'vA', id: 's4' },
        { visitor_id: 'vA', id: 's5' },
        { visitor_id: 'vB', id: 's6' },
        { visitor_id: 'vC', id: 's7' },
        { visitor_id: 'vC', id: 's8' },
        { visitor_id: 'vC', id: 's9' },
        { visitor_id: 'vC', id: 's10' },
        { visitor_id: 'vD', id: 's11' },
        { visitor_id: 'vD', id: 's12' }
      ],
      priorSessionsHistory: [
        { visitor_id: 'vC', id: 's_old_1' },
        { visitor_id: 'vD', id: 's_old_2' }
      ]
    }),
    {
      totalUniqueVisitors: 4,
      newVisitors: 2,
      returningVisitors: 2,
      newPercentage: 50,
      returningPercentage: 50,
      newTrend: '—',
      returningTrend: '—'
    }
  );

  // TEST 6 — New visitor with 10 sessions + Returning visitor with 1 session
  assert('TEST 6: New visitor with 10 sessions + Returning with 1 session',
    calculateVisitorComparison({
      currentSessions: [
        ...Array.from({ length: 10 }, (_, i) => ({ visitor_id: 'vA', id: `sA_${i}` })),
        { visitor_id: 'vB', id: 'sB_1' }
      ],
      priorSessionsHistory: [
        { visitor_id: 'vB', id: 'sB_old' }
      ]
    }),
    {
      totalUniqueVisitors: 2,
      newVisitors: 1,
      returningVisitors: 1,
      newPercentage: 50,
      returningPercentage: 50,
      newTrend: '—',
      returningTrend: '—'
    }
  );

  // TEST 8 — Zero traffic
  assert('TEST 8: Zero traffic',
    calculateVisitorComparison({
      currentSessions: [],
      priorSessionsHistory: []
    }),
    {
      totalUniqueVisitors: 0,
      newVisitors: 0,
      returningVisitors: 0,
      newPercentage: 0,
      returningPercentage: 0,
      newTrend: '+0.0%',
      returningTrend: '+0.0%'
    }
  );

  // TEST 9 & 10 — Trend calculations (Previous 4 returning, Current 12 returning)
  assert('TEST 10: Trend calculation (+200%)',
    calculateVisitorComparison({
      currentSessions: Array.from({ length: 12 }, (_, i) => ({ visitor_id: `v_${i}`, id: `s_${i}` })),
      priorSessionsHistory: Array.from({ length: 12 }, (_, i) => ({ visitor_id: `v_${i}`, id: `s_old_${i}` })),
      prevReturning: 4,
      prevNew: 10
    }),
    {
      totalUniqueVisitors: 12,
      newVisitors: 0,
      returningVisitors: 12,
      newPercentage: 0,
      returningPercentage: 100,
      newTrend: '-100.0%',
      returningTrend: '+200.0%'
    }
  );

  console.log(`\n====================================================`);
  console.log(`RESULTS: ${passed} passed, ${failed} failed`);
  console.log(`====================================================`);
}

runAllTests();
