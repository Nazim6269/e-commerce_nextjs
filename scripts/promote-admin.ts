import mongoose from "mongoose";
import { readFileSync } from "fs";
import { resolve } from "path";

// Parse .env file manually (no dotenv dependency needed)
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

if (!email) {
  console.error("Usage: npx tsx scripts/promote-admin.ts <email>");
  console.error("Example: npx tsx scripts/promote-admin.ts user@example.com");
  process.exit(1);
}

async function promoteToAdmin() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB");

    const db = mongoose.connection.db!;
    const users = db.collection("users");

    const user = await users.findOne({ email });

    if (!user) {
      console.error(`No user found with email: ${email}`);
      process.exit(1);
    }

    if (user.role === "admin") {
      console.log(`${email} is already an admin.`);
      process.exit(0);
    }

    await users.updateOne({ email }, { $set: { role: "admin" } });
    console.log(`Successfully promoted ${email} to admin.`);
    console.log("Log out and log back in for changes to take effect.");
  } catch (err) {
    console.error("Error:", err);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
}

promoteToAdmin();
