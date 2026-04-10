const mongoose = require('mongoose');

async function migrate() {
  const localUri = "mongodb://localhost:27017/ideanomics-hub";
  const atlasUri = "mongodb://geethanjalit04_db_user:Geetha%4023@ac-r4glkdi-shard-00-00.fjggwez.mongodb.net:27017,ac-r4glkdi-shard-00-01.fjggwez.mongodb.net:27017,ac-r4glkdi-shard-00-02.fjggwez.mongodb.net:27017/ideanomics-hub?ssl=true&replicaSet=atlas-10fygj-shard-0&authSource=admin&appName=Cluster0";

  console.log("Connecting to local database...");
  const localConnection = await mongoose.createConnection(localUri).asPromise();
  
  console.log("Connecting to Atlas database...");
  const atlasConnection = await mongoose.createConnection(atlasUri).asPromise();

  try {
    const localDb = localConnection.db;
    const atlasDb = atlasConnection.db;

    const collections = await localDb.listCollections().toArray();
    
    if (collections.length === 0) {
      console.log("No collections found in local database.");
      return;
    }

    for (const colInfo of collections) {
      if (colInfo.type === 'view') continue;

      const colName = colInfo.name;
      console.log(`Migrating collection: ${colName}...`);
      
      const localCol = localDb.collection(colName);
      const atlasCol = atlasDb.collection(colName);
      
      const documents = await localCol.find({}).toArray();
      if (documents.length > 0) {
        try {
            await atlasCol.insertMany(documents, { ordered: false });
            console.log(`   - Inserted ${documents.length} documents into ${colName}.`);
        } catch(e) {
            if (e.code === 11000 || String(e.message).includes('E11000')) {
                console.log(`   - Some or all documents already exist in ${colName} (skipped duplicates).`);
            } else {
                console.log(`   - Warning on ${colName}:`, e.message);
            }
        }
      } else {
        console.log(`   - Collection ${colName} is empty. Skipping.`);
      }
    }
    
    console.log("\n🎉 Migration completed successfully!");
  } catch (err) {
    console.error("Migration failed:", err);
  } finally {
    await localConnection.close();
    await atlasConnection.close();
  }
}

migrate().then(() => process.exit(0)).catch(err => { console.error(err); process.exit(1); });
