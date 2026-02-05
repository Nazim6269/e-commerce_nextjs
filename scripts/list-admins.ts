import mongoose from "mongoose";
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

async function listAdmins() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB\n");

    const db = mongoose.connection.db!;
    const users = db.collection("users");

    const admins = await users.find({ role: "admin" }).toArray();

    if (admins.length === 0) {
      console.log("No admin users found in the database.");
      console.log("\nTo promote a user to admin, run:");
      console.log("npx tsx scripts/promote-admin.ts <email>");
    } else {
      console.log(`Found ${admins.length} admin user(s):\n`);
      for (const admin of admins) {
        console.log(`Email: ${admin.email}`);
        console.log(`Name: ${admin.name}`);
        console.log(`Created: ${admin.createdAt}`);
        console.log("---");
      }
    }
  } catch (err) {
    console.error("Error:", err);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
}

listAdmins();
