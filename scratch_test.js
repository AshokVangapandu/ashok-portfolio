const apikey = "sb_publishable_Rt97581bW4IkOBlUaCNX4Q_Rldchf_z";
const url = "https://xpuhbtsgwhgbcvmwzlyd.supabase.co/rest/v1/testimonials";

async function testInsertDev() {
  const dbTestimonial = {
    full_name: "Test User Dev",
    email: "test@gmail.com",
    testimonial: "This is a test testimonial text from fetch script to dev project.",
    status: "pending",
    featured: false,
    rating: 5,
    is_visible: false
  };

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "apikey": apikey,
        "Authorization": `Bearer ${apikey}`,
        "Content-Type": "application/json",
        "Prefer": "return=minimal"
      },
      body: JSON.stringify(dbTestimonial)
    });
    console.log("Dev project insert status:", res.status);
    const body = await res.text();
    console.log("Dev project insert response:", body);
  } catch (err) {
    console.error("Error:", err);
  }
}

testInsertDev();
