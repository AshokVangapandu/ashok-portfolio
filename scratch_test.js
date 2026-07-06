const apikey = "sb_publishable_DS3aReX7DKPTUeFrfndvAQ_4p7QTYfB";

async function checkContactMessages() {
  try {
    const res = await fetch("https://txoszrnjkrlbjzpjisvp.supabase.co/rest/v1/contact_messages?limit=1", {
      method: "GET",
      headers: {
        "apikey": apikey,
        "Authorization": `Bearer ${apikey}`
      }
    });
    console.log("contact_messages status:", res.status);
    const body = await res.text();
    console.log("contact_messages response:", body);
  } catch (err) {
    console.error("Error:", err);
  }
}

checkContactMessages();
