const { nodeEnv } = require('./util');
console.log(`Running in ${nodeEnv} mode...`);

const app = require('express')();

const theSchema = require('../schema');
const graphqlHTTP = require('express-graphql');

//mongo
const { MongoClient } = require('mongodb');
const assert = require('assert');
const mongoConfig = require("./../config/mongo");

//sql
const sql = require('mssql');
const sqlConfig = require("./../config/sql");
const DataLoader = require('dataloader');
//let sqlPool = null;

const go = async () => {
  try {
    const sqlPool = await sql.connect(sqlConfig.development);
    const sqldb = require("./../database/sqldb")(sqlPool);
    const mPool = await MongoClient.connect(mongoConfig.development.url);
    const mdb = require("./../database/mdb")(mPool);

    app.use('/graphql', (req, res) => {
      const loaders = {
        usersByIds: new DataLoader(sqldb.getUsersByIds),
        usersByApiKeys: new DataLoader(sqldb.getUsersByApiKeys),
        contestsForUserIds: new DataLoader(sqldb.getContestsForUserIds),
        namesForContestIds: new DataLoader(sqldb.getNamesForContestIds),
        mdb: {
          usersByIds: new DataLoader(mdb.getUsersByIds)
        }
      };
      graphqlHTTP({
        schema: theSchema,
        graphiql: true,
        context: { sqldb, mPool, loaders }
      })(req, res);
    });
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server is listening on port ${PORT}`);
    });
  } catch (e) {
    console.log(e);
  }
};
go();
