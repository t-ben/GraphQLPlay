
const {
  GraphQLEnumType,
} = require('graphql');

module.exports = new GraphQLEnumType({
  name: 'ContestStatusType',
  values: {
    DRAFT: { value: 'draft' },  //actual db enum value is 'draft' -> we will return 'DRAFT'. this could be translating to anything we want.
    ARCHIVED: { value: 'archived' },
    PUBLISHED: { value: 'published' }
  }
});