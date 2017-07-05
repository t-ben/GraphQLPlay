// Import type helpers from graphql-js
const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLNonNull
} = require('graphql');

const UserType = require('./types/user');
//const sqldb = require("./../database/sqldb");

// The root query type is where in the data graph
// we can start asking questions
const RootQueryType = new GraphQLObjectType({
  name: 'RootQueryType',

  fields: {
    me: {
      type: UserType,
      description: 'The current user identified by api key',
      args: {
        key: { type: new GraphQLNonNull( GraphQLString ) }
      },
      resolve: (obj, args, {loaders}) => {
        // obj - the parent or null if its root
        // args - what is being passed: args.key here
        // ctx - sqlPool	
        //read from the db
        //return sqldb(sqlPool).getUserByApiKey(args.key);        //graphql will handle it even though its async !
        return loaders.usersByApiKeys.load(args.key);
      }
    }
  }
});

const AddContestMutation = require('./mutations/add-contest');
const AddNameMutation = require('./mutations/add-name');
const CountMutation = require("./mutations/count-clicks");

//mutation definition: just like a query, but fields are actually command/s:
const RootMutationType = new GraphQLObjectType({
  name: 'RootMutationType',
  fields: () => ({
    AddContest: AddContestMutation,  //commmand
    AddName: AddNameMutation,
    CountClick: CountMutation 
  })
});

const ncSchema = new GraphQLSchema({
  query: RootQueryType,
  mutation: RootMutationType
});

module.exports = ncSchema;
