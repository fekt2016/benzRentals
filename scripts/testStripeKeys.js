// Test script to verify Stripe public key is loaded correctly
// Run this in the browser console or via Node.js

console.log("🔍 Testing Frontend Stripe Public Key Configuration...\n");

// In browser, this would be:
// const publicKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY;

// For Node.js testing (using dotenv)
const fs = require("fs");
const path = require("path");

try {
  const envFile = fs.readFileSync(path.join(__dirname, "../.env"), "utf8");
  const envLines = envFile.split("\n");
  
  let publicKey = null;
  for (const line of envLines) {
    if (line.startsWith("VITE_STRIPE_PUBLIC_KEY=")) {
      publicKey = line.split("=")[1].trim();
      break;
    }
  }

  if (!publicKey) {
    console.error("❌ VITE_STRIPE_PUBLIC_KEY is not set in frontend/.env");
    process.exit(1);
  }

  const publicKeyPrefix = publicKey.substring(0, 7);
  const publicKeyType = 
    publicKeyPrefix === "pk_test" ? "TEST" : 
    publicKeyPrefix === "pk_live" ? "LIVE" : "UNKNOWN";

  console.log(`📦 Frontend Public Key:`);
  console.log(`   Type: ${publicKeyType}`);
  console.log(`   Prefix: ${publicKey.substring(0, 12)}...`);
  console.log(`   Full Key: ${publicKey}\n`);

  if (publicKeyType === "UNKNOWN") {
    console.error("❌ Invalid public key format! Should start with pk_test_ or pk_live_");
    process.exit(1);
  }

  console.log("✅ Public key format is valid!");
  console.log("\n📝 Verification:");
  console.log(`   Key Type: ${publicKeyType}`);
  console.log(`   Key Length: ${publicKey.length} characters`);
  console.log(`   Expected Length: ~107 characters for pk_test_, ~107 for pk_live_\n`);

  console.log("💡 To verify in browser:");
  console.log("   1. Open browser console");
  console.log("   2. Check for '[usePayment] Environment check:' log");
  console.log("   3. Verify the key prefix matches what you see here\n");

} catch (error) {
  console.error("❌ Error reading .env file:", error.message);
  process.exit(1);
}

