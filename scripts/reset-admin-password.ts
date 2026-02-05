import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { readFileSync } from "fs";
import { resolve } from "path";

// Parse .env file manually
const envPath = resolve(__dirname, "../.env");
const envContent = readFileSync(envPath, "utf-8");
const envVars: Record<string, string> = {};
for (const line of envContent.split("\n")) {
  const match = line.match(/^([^#=]+)=(.*)$/);
  if (match) envVars[match[1].trim()] = match[2].trim();
}

const MONGODB_URI = envVars.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("MONGODB_URI not found in .env");
  process.exit(1);
}

const email = process.argv[2];
const newPassword = process.argv[3];

if (!email || !newPassword) {
  console.error("Usage: npx tsx scripts/reset-admin-password.ts <email> <new-password>");
  console.error("Example: npx tsx scripts/reset-admin-password.ts admin@example.com newpassword123");
  process.exit(1);
}

async function resetPassword() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB\n");

    const db = mongoose.connection.db!;
    const users = db.collection("users");

    const user = await users.findOne({ email });

    if (!user) {
      console.error(`No user found with email: ${email}`);
      process.exit(1);
    }

    console.log(`Found user: ${user.name} (${user.email})`);
    console.log(`Current password hash: ${user.password?.substring(0, 20)}...`);

    // Hash the new password
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await users.updateOne({ email }, { $set: { password: hashedPassword } });

    console.log(`\nPassword reset successfully for ${email}`);
    console.log(`New password: ${newPassword}`);
    console.log("\nYou can now login with these credentials.");
  } catch (err) {
    console.error("Error:", err);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
}

resetPassword();
