const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = "https://xpuhbtsgwhgbcvmwzlyd.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhwdWhidHNnd2hnYmN2bXd6bHlkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NDgyMjc0MiwiZXhwIjoyMTAwMzk4NzQyfQ.eezTlm2uG5jq3pdfHLfdUqHzQ8Hh2YewQo4LBTnIRlc";
const supabase = createClient(supabaseUrl, supabaseKey);

// Replicate the exact logic from inviteAdmin in adminAccessService.ts
async function simulateInviteAdmin(email, role) {
  const cleanEmail = (email || '').trim().toLowerCase();
  
  // mapUiRoleToDb equivalent
  const dbRole = role === 'Super Admin' ? 'super_admin' : (role === 'Portfolio Viewer' ? 'portfolio_viewer' : 'admin');
  
  let defaultPermissions = [
    'Dashboard', 'Inquiries', 'Testimonials', 'Resume Downloads', 'Analytics'
  ];
  if (dbRole === 'super_admin') {
    defaultPermissions.push('Projects', 'Portfolio Configuration', 'Access Management');
  } else if (dbRole === 'admin') {
    defaultPermissions.push('Projects', 'Portfolio Configuration');
  }

  console.log(`[simulateInviteAdmin] Checking if admin already exists: ${cleanEmail}`);
  const { data: existingAdmin, error: checkError } = await supabase
    .from('admins')
    .select('*')
    .eq('email', cleanEmail)
    .maybeSingle();

  if (checkError) {
    throw checkError;
  }

  let isReinvite = false;

  if (existingAdmin) {
    console.log('[simulateInviteAdmin] Admin record exists. Re-inviting/reactivating...');
    isReinvite = true;

    const { error: updateError } = await supabase
      .from('admins')
      .update({
        role: dbRole,
        status: 'Pending',
        is_active: true,
        permissions: defaultPermissions
      })
      .eq('id', existingAdmin.id);

    if (updateError) {
      throw updateError;
    }
  } else {
    console.log('[simulateInviteAdmin] Admin record does not exist. Creating new pending admin...');
    const payload = {
      email: cleanEmail,
      role: dbRole,
      status: 'Pending',
      is_active: true,
      full_name: 'Pending Invite',
      permissions: defaultPermissions
    };

    const { error: insertError } = await supabase
      .from('admins')
      .insert(payload);

    if (insertError) {
      throw insertError;
    }
  }

  // Invoke Edge Function
  let emailSent = true;
  let emailError = null;
  try {
    console.log(`[simulateInviteAdmin] Invoking send-admin-invitation edge function...`);
    const { data: invokeData, error: invokeError } = await supabase.functions.invoke('send-admin-invitation', {
      body: { email: cleanEmail, role: role }
    });
    if (invokeError) {
      emailSent = false;
      emailError = invokeError.message || 'Failed to trigger invitation email';
    }
  } catch (err) {
    emailSent = false;
    emailError = err.message || 'Exception during email dispatch';
  }

  return { success: true, emailSent, emailError, isReinvite };
}

async function runTests() {
  const testEmail = "new-test-admin-unique-12345@example.com";
  const testRole = "Admin";
  
  console.log("====================================================");
  console.log("STARTING TEST RUN FOR RE-INVITATION WORKFLOW");
  console.log("====================================================\n");

  try {
    // 0. Cleanup existing records
    console.log("Cleaning up any existing record for test email...");
    await supabase.from('admins').delete().eq('email', testEmail);
    
    // SCENARIO 1: Brand New Invite
    console.log("\n--- Scenario 1: Invite a brand-new administrator ---");
    const result1 = await simulateInviteAdmin(testEmail, testRole);
    console.log("Result 1:", result1);
    
    // Verify DB state
    const { data: dbAdmin1 } = await supabase.from('admins').select('*').eq('email', testEmail).maybeSingle();
    console.log("Database state after Scenario 1:", {
      email: dbAdmin1?.email,
      status: dbAdmin1?.status,
      is_active: dbAdmin1?.is_active,
      role: dbAdmin1?.role
    });
    if (dbAdmin1 && dbAdmin1.status === 'Pending' && dbAdmin1.is_active === true && !result1.isReinvite) {
      console.log("✓ SCENARIO 1 PASSED!");
    } else {
      console.error("✗ SCENARIO 1 FAILED!");
      process.exit(1);
    }

    // SCENARIO 2: Re-invite Pending Admin
    console.log("\n--- Scenario 2: Invite the same administrator again ---");
    const result2 = await simulateInviteAdmin(testEmail, testRole);
    console.log("Result 2:", result2);
    
    // Verify DB state
    const { data: dbAdmin2 } = await supabase.from('admins').select('*').eq('email', testEmail).maybeSingle();
    console.log("Database state after Scenario 2:", {
      email: dbAdmin2?.email,
      status: dbAdmin2?.status,
      is_active: dbAdmin2?.is_active,
      role: dbAdmin2?.role
    });
    if (dbAdmin2 && dbAdmin2.status === 'Pending' && dbAdmin2.is_active === true && result2.isReinvite) {
      console.log("✓ SCENARIO 2 PASSED!");
    } else {
      console.error("✗ SCENARIO 2 FAILED!");
      process.exit(1);
    }

    // SCENARIO 3: Re-invite Deactivated/Inactive Admin
    console.log("\n--- Scenario 3: Deactivate admin and invite again ---");
    console.log("Deactivating admin record in DB...");
    await supabase.from('admins').update({ status: 'Inactive', is_active: false }).eq('email', testEmail);
    
    const result3 = await simulateInviteAdmin(testEmail, testRole);
    console.log("Result 3:", result3);
    
    // Verify DB state
    const { data: dbAdmin3 } = await supabase.from('admins').select('*').eq('email', testEmail).maybeSingle();
    console.log("Database state after Scenario 3:", {
      email: dbAdmin3?.email,
      status: dbAdmin3?.status,
      is_active: dbAdmin3?.is_active,
      role: dbAdmin3?.role
    });
    if (dbAdmin3 && dbAdmin3.status === 'Pending' && dbAdmin3.is_active === true && result3.isReinvite) {
      console.log("✓ SCENARIO 3 PASSED!");
    } else {
      console.error("✗ SCENARIO 3 FAILED!");
      process.exit(1);
    }

    // Cleaning up at the end
    console.log("\nCleaning up test record...");
    await supabase.from('admins').delete().eq('email', testEmail);
    
    console.log("\n====================================================");
    console.log("ALL TESTS COMPLETED SUCCESSFULLY!");
    console.log("====================================================");

  } catch (err) {
    console.error("Test execution failed with exception:", err);
    process.exit(1);
  }
}

runTests();
