/**
 * Migration script to hash existing plaintext passwords in the database.
 *
 * Usage: npx tsx scripts/migrate-passwords.ts
 *
 * This script:
 * 1. Connects to MongoDB
 * 2. Finds all users whose passwords are not bcrypt hashed
 * 3. Hashes their passwords with bcrypt (salt rounds: 12)
 * 4. Updates the records in the database
 */

import bcrypt from "bcryptjs";
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("MONGODB_URI environment variable is required");
  process.exit(1);
}

async function migratePasswords() {
  await mongoose.connect(MONGODB_URI!);
  console.log("Connected to MongoDB");

  const db = mongoose.connection.db!;
  const usersCollection = db.collection("users");

  const users = await usersCollection.find({ password: { $exists: true } }).toArray();
  console.log(`Found ${users.length} users with passwords`);

  let migrated = 0;
  let skipped = 0;

  for (const user of users) {
    // Skip if password is already a bcrypt hash (starts with $2a$ or $2b$)
    if (
      user.password &&
      (user.password.startsWith("$2a$") || user.password.startsWith("$2b$"))
    ) {
      skipped++;
      continue;
    }

    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(user.password, salt);

    await usersCollection.updateOne(
      { _id: user._id },
      {
        $set: { password: hashedPassword },
        $unset: { confirmPassword: "" },
      }
    );

    migrated++;
    console.log(`Migrated password for user: ${user.email}`);
  }

  console.log(`\nMigration complete: ${migrated} migrated, ${skipped} already hashed`);
  await mongoose.disconnect();
  process.exit(0);
}

migratePasswords().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
