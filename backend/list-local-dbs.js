const mongoose = require('mongoose');

async function main() {
  try {
    await mongoose.connect('mongodb://localhost:27017/admin');
    const dbs = await mongoose.connection.db.admin().listDatabases();
    console.log("Local Databases:");
    dbs.databases.forEach(db => {
      // Filter out internal MongoDB admin databases if we want
      if (['admin', 'local', 'config'].includes(db.name)) return;
      console.log(` - ${db.name}`);
    });
    process.exit(0);
  } catch (e) {
    console.error('Error connecting to local mongodb:', e.message);
    process.exit(1);
  }
}
main();
