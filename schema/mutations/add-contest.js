const {
  GraphQLInputObjectType,
  GraphQLString,
  GraphQLNonNull
} = require('graphql');

const Contest = require('./../types/contest');
const ContestInputType = new GraphQLInputObjectType({
  name: 'ContestInput',
  fields: {
    apiKey: { type: new GraphQLNonNull(GraphQLString) },  //to validate the user 
    title: { type: new GraphQLNonNull(GraphQLString) },
    description: { type: GraphQLString },
  }
});

module.exports = {
  type: Contest,  //whats returned after mutation execution
  args: {
    input: { type: new GraphQLNonNull(ContestInputType)}
  },
  resolve( obj, { input }, { sqldb }){
    //persist the input(ContestInputType) into the sql db as a contest.
    //return a Contest type
    return sqldb.addNewContest(input);  //should return a Contest
  }
}