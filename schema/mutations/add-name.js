const {
  GraphQLInputObjectType,
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLNonNull  
} = require('graphql');

const Name = require('../types/name');

const NameInputType = new GraphQLInputObjectType({
  name: 'NameInput',
  fields: {
    apiKey: { type: new GraphQLNonNull(GraphQLString) },
    label: { type: new GraphQLNonNull(GraphQLString) },
    contestId: { type: new GraphQLNonNull(GraphQLInt) },
    description: { type: GraphQLString }
  }
});

module.exports = {
  type: Name, //what (type) we return in result
  args: {
    input: {type: new GraphQLNonNull(NameInputType)}
  },
  resolve: (obj, { input }, { sqldb }) => {
    return sqldb.addNewName(input);
  }
}

/*
example:
mutation AddingName($input: NameInput!){
  AddName(input: $input){
    id
    label
    description
    createdAt
    createdBy{
      fullName
    }
  }
}

//query variables:
{
  "input": {
    "apiKey": "0000",
    "label": "The Pai Garage",
    "contestId": 3,
    "description": "a name for a coocking website"
  }
}

//response example:
{
  "data": {
    "AddName": {
      "id": "7",
      "label": "The Pai Garage",
      "description": "a name for a coocking website",
      "createdAt": "Wed Jul 05 2017 09:23:05 GMT-0500 (Central Daylight Time)",
      "createdBy": {
        "fullName": "undefined undefined"
      }
    }
  }
}

*/