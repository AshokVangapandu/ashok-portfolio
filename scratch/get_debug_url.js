async function getDebugUrl() {
  try {
    const res = await fetch('http://127.0.0.1:9222/json/list');
    const data = await res.json();
    console.log(JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Failed to query remote debugging endpoint:', err.message);
  }
}
getDebugUrl();
