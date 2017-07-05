const {
  GraphQLEnumType
} = require('graphql');

module.exports = new GraphQLEnumType({
  name: 'ActionDirection',
  values: {
    UP: { value: 'UP' },
    DOWN: { value: 'DOWN' }
  }
});