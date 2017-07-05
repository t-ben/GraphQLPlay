const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLInt,
  GraphQLString,
  GraphQLNonNull,
} = require('graphql');

//const sqldb = require("./../../database/sqldb");

module.exports = new GraphQLObjectType({
  name: 'Name',

  fields: () => {
    const UserType = require("./user");
    return {
      id: { type: GraphQLID },
      label: { type: new GraphQLNonNull(GraphQLString) },
      description: { type: GraphQLString },
      createdAt: { type: new GraphQLNonNull(GraphQLString) },
      createdBy: {
        type: new GraphQLNonNull(UserType),
        resolve(obj, args, { loaders }) { 
          console.log(`createdBy resolve: obj.createdBy=${obj.createdBy}`);         
          return loaders.usersByIds.load(obj.createdBy);          
          //code before using dataloader:
          //return sqldb(sqlPool).getUserById(obj.createdBy);
        }
      },
    };
  }
});