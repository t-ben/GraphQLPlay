
//const sqldb = require("./../../database/sqldb");
//const mdb = require("./../../database/mdb");

// Import type helpers from graphql-js
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLNonNull,
  GraphQLID,
  GraphQLList,
  GraphQLInt
} = require('graphql');

module.exports = new GraphQLObjectType({
  name: 'UserType',
  fields: () => {
    const ContestType = require("./contest");
    return {
      //TAKE FIELDS FROM SQL: users table
      id: { type: GraphQLID },
      email: { type: new GraphQLNonNull(GraphQLString) },
      firstName: { type: GraphQLString },//fromSnakeCase(GraphQLString),  //since the db field is first_name
      lastName: { type: GraphQLString },
      fullName: { //computed example
        type: GraphQLString,
        resolve: obj => `${obj.firstName} ${obj.lastName}`
      },
      createdAt: { type: GraphQLString },
      contests: {
        type: new GraphQLList(ContestType),
        resolve: (obj, args, { loaders }) => {
          //return sqldb(sqlPool).getContests(obj);
          console.log(`user resolving contests for id: ${obj.id}`);
          console.dir(obj);
          return loaders.contestsForUserIds.load(obj.id);
        }
      },
      //TAKE FIELDS FROM MONGO: (EACH field WILL make a seperate CALL !! )
      contestsCount: {
        type: GraphQLInt,
        resolve: (obj, args, { loaders }, { fieldName }) => {  //this is the 'contestsCount' - our current field name
          return loaders.mdb.usersByIds.load(obj.id).then(res => res[fieldName]);
        }
      },
      namesCount: {
        type: GraphQLInt,
        resolve: (obj, args, { loaders }, { fieldName }) => { //'namesCount'
          return loaders.mdb.usersByIds.load(obj.id).then(res => res[fieldName]);
        }
      },
      votesCount: {
        type: GraphQLInt,
        resolve: (obj, args, { loaders }, { fieldName }) => { //'votesCount'
          return loaders.mdb.usersByIds.load(obj.id).then(res => res[fieldName]); //mdb(mPool).getCounts(obj, fieldName);
        }
      }
    }
  }
});