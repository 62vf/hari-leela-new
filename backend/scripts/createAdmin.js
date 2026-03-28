const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Admin = require('../models/admin');

dotenv.config();

function getArgValue(flag) {
  const index = process.argv.indexOf(flag);
  if (index === -1) return null;
  return process.argv[index + 1] ?? null;
}

async function main() {
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    console.error('Missing MONGO_URI env var');
    process.exit(1);
  }

  const username = getArgValue('--username') || process.env.ADMIN_USERNAME || 'admin';
  const email = getArgValue('--email') || process.env.ADMIN_EMAIL || 'admin@example.com';
  const password = getArgValue('--password') || process.env.ADMIN_PASSWORD;
  const force = process.argv.includes('--force');

  if (!password) {
    console.error('Missing admin password. Provide --password <value> or set ADMIN_PASSWORD env var.');
    process.exit(1);
  }

  await mongoose.connect(mongoUri);

  try {
    const existing = await Admin.findOne({ username });

    if (existing) {
      if (!force) {
        console.log(`Admin '${username}' already exists. Use --force to reset password.`);
        return;
      }
      existing.email = email;
      existing.password = password; // will be hashed by pre-save hook
      await existing.save();
      console.log(`Admin '${username}' password reset successfully.`);
      return;
    }

    const admin = new Admin({ username, email, password });
    await admin.save();
    console.log(`Admin '${username}' created successfully.`);
  } finally {
    await mongoose.disconnect();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
