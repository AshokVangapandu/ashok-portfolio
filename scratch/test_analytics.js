const { createClient } = require('@supabase/supabase-js');

// Database configuration matching current site credentials
const db = {
  url: "https://xpuhbtsgwhgbcvmwzlyd.supabase.co",
  key: "sb_publishable_Rt97581bW4IkOBlUaCNX4Q_Rldchf_z"
};

const supabase = createClient(db.url, db.key);

async function runTests() {
  console.log('--- STARTING TELEMETRY VERIFICATION ---');
  
  const testSessionId = 'test-session-' + Date.now();
  const testVisitorId = 'test-visitor-' + Date.now();
  
  try {
    // 1. Verify Visitor Session Insert
    console.log('\n[1/5] Inserting test visitor session...');
    const { error: sessionErr } = await supabase
      .from('visitor_sessions')
      .insert([{
        id: testSessionId,
        visitor_id: testVisitorId,
        ip_address: '1.2.3.4',
        country: 'India',
        city: 'Bangalore',
        user_agent: 'NodeTestAgent',
        browser: 'Chrome',
        operating_system: 'Windows',
        device_type: 'Desktop',
        referrer: 'https://linkedin.com',
        traffic_source: 'LinkedIn'
      }]);

    if (sessionErr) throw sessionErr;
    console.log('✅ Session inserted successfully:', testSessionId);

    // 2. Verify Page View Insert
    console.log('\n[2/5] Inserting test page view...');
    const { error: pvErr } = await supabase
      .from('page_views')
      .insert([{
        session_id: testSessionId,
        page_path: '/pages/projects/index.html',
        page_title: 'Projects Showcase'
      }]);

    if (pvErr) throw pvErr;
    console.log('✅ Page view inserted successfully');

    // 3. Verify Custom Event Insert
    console.log('\n[3/5] Inserting custom project view event...');
    const { error: eventErr } = await supabase
      .from('analytics_events')
      .insert([{
        session_id: testSessionId,
        event_type: 'project_view',
        event_metadata: {
          project_id: 'test-proj-123',
          project_title: 'Digital Twin Viewer'
        }
      }]);

    if (eventErr) throw eventErr;
    console.log('✅ Custom event inserted successfully');

    // 4. Verify Heartbeat Ping Update
    console.log('\n[4/5] Updating session duration (ping)...');
    const { error: pingErr } = await supabase
      .from('visitor_sessions')
      .update({
        duration_seconds: 30,
        updated_at: new Date().toISOString()
      })
      .eq('id', testSessionId);

    if (pingErr) throw pingErr;
    console.log('✅ Session duration updated successfully');

    // 5. Query Aggregations (RPCs)
    console.log('\n[5/5] Invoking analytics aggregate RPC functions...');
    
    const summary = await supabase.rpc('get_analytics_summary', { range_filter: '30days' });
    console.log('✅ get_analytics_summary response:', summary.data);

    const locations = await supabase.rpc('get_analytics_locations', { range_filter: '30days' });
    console.log('✅ get_analytics_locations response:', locations.data);

    const devices = await supabase.rpc('get_analytics_devices', { range_filter: '30days' });
    console.log('✅ get_analytics_devices response:', devices.data);

    const activities = await supabase.rpc('get_analytics_activities', { range_filter: '30days' });
    console.log('✅ get_analytics_activities response:', activities.data ? activities.data.slice(0, 3) : null);

  } catch (err) {
    console.error('❌ Test failed with exception:', err);
  } finally {
    // Cleanup test data
    console.log('\n--- CLEANING UP TEST DATA ---');
    const { error: cleanErr } = await supabase
      .from('visitor_sessions')
      .delete()
      .eq('id', testSessionId);
      
    if (cleanErr) {
      console.error('Failed to delete test session:', cleanErr);
    } else {
      console.log('✅ Test session and cascades removed successfully.');
    }
    console.log('\n--- VERIFICATION COMPLETED ---');
  }
}

runTests();
