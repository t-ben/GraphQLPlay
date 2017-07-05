/**
 * a simple Graphql mutation to count UP or DOWN on a cached counter.
 * using an enum values for action direction in the input object. 
 */
const {
  GraphQLInputObjectType,
  GraphQLObjectType,
  GraphQLInt,
  GraphQLNonNull  
} = require('graphql');

//the cached counter:
let accumulator = 0;

//the enum:
const ActionDirection = require('../types/action-directions');

//input definition object type:
const CountInputType = new GraphQLInputObjectType({
  name: 'CountInputType',
  fields: {
    direction: {type: ActionDirection}  //enum UP / DOWN    
  }
});

//response definition object type:
const CountActionResult = new GraphQLObjectType({
  name: 'CountResultType',
  fields: {
    total: { type: GraphQLInt }
  }
})

//the mutation type:
module.exports = {
  type: CountActionResult,  //the return type
  args: {
    input: {type: new GraphQLNonNull(CountInputType)}
  },
  resolve: (obj, { input }) => {
    console.log(input.direction);
    switch(input.direction) {
      case "UP":{
        accumulator ++;
        break;
      }
      case "DOWN":{
        accumulator--;
        break;
      }
    }
    
    return {total: accumulator};
  }
}